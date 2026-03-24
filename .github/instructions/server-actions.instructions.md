---
description: Read this file for all instructions related to server actions and data mutations in the Link Shortener Project.
---

# Server Actions Guidelines

## Core Rules

1. **ALL data mutations** (create, update, delete) MUST be performed via **server actions**. Never mutate data through API routes, inline server functions, or direct client-side calls.

2. **Server actions MUST be called from client components** (`"use client"`). Do not invoke server actions from server components.

3. **Server action files MUST be named `actions.ts`** and colocated in the same directory as the component that calls them. Each `actions.ts` file must begin with `"use server";`.

4. **Never use the `FormData` type** for server action parameters. All data passed to server actions must use properly typed TypeScript interfaces or types.

5. **Validate all input with Zod** inside every server action before performing any logic.

6. **Check authentication first.** Every server action must verify the user is logged in via Clerk's `auth()` before executing any database operation. Return an appropriate error if unauthenticated.

7. **Use `/data` helper functions for all database operations.** Server actions must NOT import or use Drizzle queries directly. All database interactions go through the helper functions in the `/data` directory.

8. **Never throw errors from server actions.** Server actions must always return a result object with either an `error` or `data` property — never throw exceptions. Wrap any potentially failing logic in try/catch and return `{ error: "..." }` on failure.

## File Structure

```
app/
  dashboard/
    page.tsx              # Server component (renders the form component)
    components/
      LinkForm.tsx         # Client component ("use client") — calls the server action
      actions.ts           # Server action file ("use server") — colocated with LinkForm
```

## Server Action Template

```typescript
// app/dashboard/components/actions.ts
"use server";

import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { createLink } from "@/data/links";

const CreateLinkSchema = z.object({
  url: z.string().url("Please enter a valid URL"),
  slug: z.string().min(3, "Slug must be at least 3 characters"),
});

type CreateLinkInput = z.infer<typeof CreateLinkSchema>;

export async function createLinkAction(input: CreateLinkInput) {
  const { userId } = await auth();

  if (!userId) {
    return { error: "Unauthorized" };
  }

  const parsed = CreateLinkSchema.safeParse(input);

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  try {
    const link = await createLink({ ...parsed.data, userId });
    return { data: link };
  } catch {
    return { error: "Failed to create link" };
  }
}
```

## Client Component Usage

```typescript
// app/dashboard/components/LinkForm.tsx
"use client";

import { createLinkAction } from "./actions";

export function LinkForm() {
  async function handleSubmit(data: { url: string; slug: string }) {
    const result = await createLinkAction(data);

    if (result.error) {
      // handle error
      return;
    }

    // handle success
  }

  // render form...
}
```

## Checklist

- [ ] Server action file is named `actions.ts` with `"use server"` directive
- [ ] Colocated with the client component that calls it
- [ ] All parameters use typed TypeScript interfaces (no `FormData`)
- [ ] Input validated with Zod before any logic
- [ ] `auth()` check runs before any database operation
- [ ] Database operations use `/data` helper functions (no direct Drizzle queries)
- [ ] Server action never throws — always returns `{ error }` or `{ data }`
