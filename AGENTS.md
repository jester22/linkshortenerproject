---
description: "Agent instructions for the Link Shortener Project"
---

# 🤖 Agent Instructions: Link Shortener Project

## Overview

This document serves as the primary instruction set for LLMs (Language Learning Models) and AI agents working on the **Link Shortener Project**. These instructions ensure consistent code quality, adherence to project standards, and maintainability across all contributions.

The project is a modern URL shortening service built with **Next.js 16**, **React 19**, **TypeScript**, **Tailwind CSS**, and **Drizzle ORM**.

## Quick Reference

### Technology Stack

- **Frontend**: Next.js 16.1.7 (App Router), React 19, Tailwind CSS 4, shadcn/ui
- **Backend**: Node.js, Next.js API Routes, Server Components/Actions
- **Database**: PostgreSQL (Neon serverless) with Drizzle ORM
- **Authentication**: Clerk
- **Type Safety**: TypeScript 5 with strict mode enabled
- **Code Quality**: ESLint 9

### Project Structure

```
linkshortenerproject/
├── app/                   # Next.js App Router
├── components/            # React components (UI + feature)
├── db/                    # Database schema & config
├── lib/                   # Utilities and helpers
└── public/                # Static assets
```

## 🚨 NEVER Use `middleware.ts`

> **`middleware.ts` is deprecated in Next.js 16 and later versions (including the version used in this project).**
> This project uses **`proxy.ts`** instead. NEVER create, suggest, or reference a `middleware.ts` file.

- All route protection, redirects, and request interception logic belongs in **`proxy.ts`** at the project root.
- If you encounter any documentation, tutorial, or AI-generated code that uses `middleware.ts`, **do not follow it** — adapt the logic to `proxy.ts` instead.
- The existing `proxy.ts` already handles Clerk authentication and route matching. Extend it there when needed.

## Core Principles

### 1. **Strict Type Safety**

- Use TypeScript with strict mode enabled
- No `any` types - use proper types or `unknown` with guards
- Always annotate function signatures
- Leverage type inference where appropriate

### 2. **Code Clarity**

- Write readable, self-documenting code
- Use descriptive variable and function names
- Extract complex logic into well-named functions
- Add JSDoc comments for exported functions

### 3. **Consistency**

- Follow the naming conventions defined in CODE_STYLE.md
- Use the established patterns for components, routes, and queries
- Maintain consistent code formatting (ESLint)
- Use provided utilities (`cn()`, etc.) for common tasks

### 4. **Security First**

- Always validate user input (client and server)
- Verify user ownership before returning/modifying data
- Never hardcode secrets or sensitive data
- Use environment variables for configuration

### 5. **Performance**

- Optimize database queries (limit columns, use pagination)
- Implement code splitting for large features
- Use `React.memo()` and `useCallback()` judiciously
- Cache data appropriately

### 6. **Accessibility**

- Use semantic HTML elements
- Include ARIA labels for interactive elements
- Ensure keyboard navigation works
- Test with screen readers

### Environment Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Type checking
npm run lint

# Build for production
npm run build
```

## Common Tasks

### Implementing Protected Routes

2. Remember: Clerk is the ONLY authentication method allowed
3. Use `mode="modal"` for all sign-in and sign-up buttons
4. Protect `/dashboard` route - must require login
5. Redirect logged-in users from homepage to `/dashboard` (handled in `proxy.ts` — **NOT** `middleware.ts`)
6. Add Clerk auth check to route/component
7. Return 401 for unauthenticated users
8. Verify user ownership before returning data
9. Handle sign-in redirects appropriately

## Code Review Checklist

Before submitting code for review, ensure:

- [ ] **TypeScript**: Passes `npm run lint` without errors
- [ ] **Types**: All functions have explicit type annotations
- [ ] **Naming**: Follows conventions from CODE_STYLE.md
- [ ] **Documentation**: Exported functions have JSDoc comments
- [ ] **Security**: All inputs validated, ownership verified
- [ ] **Tests**: Manual testing completed (happy path + errors)
- [ ] **Accessibility**: Keyboard navigation works, ARIA labels present
- [ ] **Performance**: Database queries optimized, no N+1 queries
- [ ] **Responsiveness**: Works on mobile and desktop
- [ ] **Dark Mode**: Includes `dark:` prefixes where relevant

## Examples

### ✅ Good Example - Component with Props

```typescript
// components/LinkCard.tsx
import { Button } from "@/components/ui/button";
import type { Link } from "@/db/schema";

interface LinkCardProps {
  readonly link: Link;
  readonly onDelete: (id: number) => Promise<void>;
}

/**
 * Displays a shortened link card with metadata and actions.
 *
 * @param link - The link data to display
 * @param onDelete - Callback when delete button is clicked
 */
export function LinkCard({ link, onDelete }: LinkCardProps): JSX.Element {
  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
      <h3 className="font-semibold text-gray-900 dark:text-white">
        {link.title || "Untitled"}
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        {link.slug}
      </p>
      <Button onClick={() => onDelete(link.id)}>Delete</Button>
    </div>
  );
}
```

### ✅ Good Example - API Route

```typescript
// app/api/links/[id]/route.ts
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import db from "@/db";
import { links } from "@/db/schema";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const linkId = parseInt(params.id, 10);

  // Verify ownership
  const existing = await db.select().from(links).where(eq(links.id, linkId));

  if (!existing[0] || existing[0].userId !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await db.delete(links).where(eq(links.id, linkId));

  return NextResponse.json({ success: true });
}
```

## Maintenance & Updates

This instruction set should be kept up-to-date as the project evolves. When:

- **Adding new patterns**: Add to relevant documentation file
- **Changing conventions**: Update CODE_STYLE.md and notify team
- **Discovering gotchas**: Add to BEST_PRACTICES.md

---

**Last Updated**: March 2026  
**Project**: Link Shortener  
**Status**: Active Development
