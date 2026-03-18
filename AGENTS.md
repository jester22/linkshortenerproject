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
├── docs/                  # Agent instruction files
└── public/                # Static assets
```

## Detailed Documentation

Each aspect of development is documented in separate files in the `/docs` directory. **Always reference the relevant documentation** before implementing features or making changes.

## 🚨 Non-Negotiable Rule: Read Docs First

Before generating, suggesting, or modifying **any code**, you MUST read the relevant individual instruction files in `/docs` for the task at hand.

- This is mandatory and has top priority over implementation speed.
- Do not write code first and check docs later.
- If multiple docs are relevant (for example auth + UI + best practices), read all relevant files before coding.
- If no relevant `/docs` file has been reviewed yet, stop and review it first.

- [UI-COMPONENTS.md](./docs/UI-COMPONENTS.md) - shadcn/ui component guidelines and best practices
- [AUTHENTICATION.md](./docs/AUTHENTICATION.md) - Authentication and protected routes
- [CODE_STYLE.md](./docs/CODE_STYLE.md) - Naming conventions and code formatting
- [PROJECT_OVERVIEW.md](./docs/PROJECT_OVERVIEW.md) - Project structure and architecture
- [BEST_PRACTICES.md](./docs/BEST_PRACTICES.md) - Performance, security, and optimization

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

## Before You Start

### Checklist
- [ ] BEFORE WRITING ANY CODE: Read all relevant instruction files in `/docs` for this specific task
- [ ] Read [PROJECT_OVERVIEW.md](./docs/PROJECT_OVERVIEW.md) to understand the project
- [ ] Review [CODE_STYLE.md](./docs/CODE_STYLE.md) for naming and formatting rules
- [ ] Review [UI-COMPONENTS.md](./docs/UI-COMPONENTS.md) for component usage (shadcn/ui)
- [ ] Identify which documentation file(s) are relevant to your task
- [ ] Ensure TypeScript strict mode passes before committing

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
1. Read: [AUTHENTICATION.md](./docs/AUTHENTICATION.md) - **This is critical - review the ⚠️ Critical Rules section**
2. Remember: Clerk is the ONLY authentication method allowed
3. Use `mode="modal"` for all sign-in and sign-up buttons
4. Protect `/dashboard` route - must require login
5. Redirect logged-in users from homepage to `/dashboard` (handled in middleware)
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

## When You Get Stuck

1. **Check the documentation** in `/docs` for your specific task
2. **Search for similar patterns** in existing code
3. **Type error?** Read the error carefully - TypeScript is usually right
4. **Performance issue?** Check [BEST_PRACTICES.md](./docs/BEST_PRACTICES.md#performance)
5. **Security concern?** Read [BEST_PRACTICES.md](./docs/BEST_PRACTICES.md#security)
6. **Design question?** Review existing components/patterns

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
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 },
    );
  }

  const linkId = parseInt(params.id, 10);

  // Verify ownership
  const existing = await db
    .select()
    .from(links)
    .where(eq(links.id, linkId));

  if (!existing[0] || existing[0].userId !== userId) {
    return NextResponse.json(
      { error: "Forbidden" },
      { status: 403 },
    );
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
