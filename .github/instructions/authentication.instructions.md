---
description: Read this file for all instructions related to authentication in the Link Shortener Project.
---
# Authentication Guidelines

## ⚠️ Critical Rules

### Single Authentication Provider
**Clerk is the ONLY authentication method used in this application.** No other auth solutions (Auth0, NextAuth, custom implementations, etc.) should be introduced. All authentication must go through Clerk.

### Protected Routes
- **`/dashboard`** - Must require user to be logged in. Redirect to sign-in if not authenticated.
- **Homepage (`/`)** - If a logged-in user accesses the homepage, they should be redirected to `/dashboard`.

### Sign In & Sign Up UI
- Clerk `SignInButton`, `SignUpButton`, and related components **must always use `mode="modal"`**
- This ensures sign-in/up opens as a modal overlay, not a separate page
- Full-page sign-in/up pages should only be created for error states or accessibility fallbacks

## Clerk Setup

### Environment Variables
Required `.env` file variables:
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key
CLERK_SECRET_KEY=your_secret_key
```

### Root Layout Configuration
```typescript
// app/layout.tsx
import { ClerkProvider } from "@clerk/nextjs";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        <ClerkProvider>
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
```

## Protected Routes

### Route Protection in API Routes

```typescript
// app/api/links/route.ts
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { userId, sessionId } = await auth();

  if (!userId) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 },
    );
  }

  // userId is guaranteed to exist
  const userLinks = await getUserLinks(userId);
  return NextResponse.json({ data: userLinks });
}
```

### Route Protection in Middleware

```typescript
// middleware.ts (root directory)
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/api/links(.*)",
  "/api/user(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  // Protect dashboard route
  if (isProtectedRoute(req)) {
    await auth.protect();
  }

  // Redirect logged-in users from homepage to dashboard
  if (req.nextUrl.pathname === "/" && auth.userId) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
```

### Protected Server Components

```typescript
// app/dashboard/page.tsx
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div>
      Welcome back!
    </div>
  );
}
```

### Homepage with User Redirect

The middleware handles redirecting logged-in users from `/` to `/dashboard`. Your homepage should be designed for unauthenticated users only.

```typescript
// app/page.tsx (Homepage)
import { auth } from "@clerk/nextjs/server";

export default async function HomePage() {
  const { userId } = await auth();

  // If somehow user got here while logged in, show an appropriate message
  if (userId) {
    return <div>Redirecting to dashboard...</div>;
  }

  return (
    <div>
      {/* Show sign-in/up buttons or introduction for unauthenticated users */}
      <h1>Welcome to Link Shortener</h1>
      <p>Sign in to get started</p>
    </div>
  );
}
```

### Protected Client Components

```typescript
// components/Dashboard.tsx
"use client";

import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function Dashboard() {
  const { userId, isLoaded } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !userId) {
      router.push("/sign-in");
    }
  }, [isLoaded, userId, router]);

  if (!isLoaded || !userId) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      Welcome back!
    </div>
  );
}
```

## User Context

### Getting User Information

```typescript
// Server-side
import { auth, currentUser } from "@clerk/nextjs/server";

export async function getAuthInfo() {
  const { userId } = await auth();
  const user = await currentUser();

  return {
    userId,
    email: user?.emailAddresses[0]?.emailAddress,
    firstName: user?.firstName,
    lastName: user?.lastName,
  };
}
```

```typescript
// Client-side
"use client";

import { useAuth, useUser } from "@clerk/nextjs";

export function UserInfo() {
  const { userId, isLoaded } = useAuth();
  const { user } = useUser();

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div>
      <p>ID: {userId}</p>
      <p>Email: {user?.emailAddresses[0]?.emailAddress}</p>
    </div>
  );
}
```

## Sign In & Sign Up UI

### Pre-built Components

```typescript
// app/(auth)/sign-in/page.tsx
import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <SignIn />
    </div>
  );
}
```

### Buttons

**IMPORTANT**: Use `mode="modal"` for all sign-in and sign-up buttons.

```typescript
// app/layout.tsx
import {
  SignInButton,
  SignUpButton,
  SignOutButton,
  Show,
  UserButton,
} from "@clerk/nextjs";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        <header className="flex justify-between items-center p-4">
          <h1>Link Shortener</h1>
          <nav className="flex gap-4">
            <Show when="signed-out">
              {/* Always use mode="modal" for sign-in */}
              <SignInButton mode="modal" />
              {/* Always use mode="modal" for sign-up */}
              <SignUpButton mode="modal" />
            </Show>

            <Show when="signed-in">
              <UserButton />
            </Show>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
```

## Server Actions with Auth

```typescript
// lib/actions/secure-action.ts
"use server";

import { auth } from "@clerk/nextjs/server";

interface SecureActionResult<T> {
  success: boolean;
  error?: string;
  data?: T;
}

export async function secureAction<T>(
  handler: (userId: string) => Promise<T>,
): Promise<SecureActionResult<T>> {
  try {
    const { userId } = await auth();

    if (!userId) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    const result = await handler(userId);

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error("[secureAction]", error);
    return {
      success: false,
      error: "An error occurred",
    };
  }
}

// Usage
export async function getUserLinksAction() {
  return secureAction(async (userId) => {
    return await getUserLinks(userId);
  });
}
```

## Webhook Handling (Optional)

```typescript
// app/api/webhooks/clerk/route.ts
import { Webhook } from "svix";
import { NextRequest, NextResponse } from "next/server";

const webhookSecret = process.env.CLERK_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  const payload = await req.json();
  const headers = {
    "svix-id": req.headers.get("svix-id"),
    "svix-timestamp": req.headers.get("svix-timestamp"),
    "svix-signature": req.headers.get("svix-signature"),
  };

  const wh = new Webhook(webhookSecret);
  let evt;

  try {
    evt = wh.verify(JSON.stringify(payload), headers);
  } catch (err) {
    console.error("Webhook verification failed:", err);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const eventType = evt.type;

  if (eventType === "user.created") {
    // Handle user creation
    const { id, email_addresses } = evt.data;
    console.log(`New user created: ${id}`);
  }

  if (eventType === "user.updated") {
    // Handle user update
    const { id } = evt.data;
    console.log(`User updated: ${id}`);
  }

  return NextResponse.json({ success: true });
}
```

## Best Practices

### Security
- Always verify `userId` before performing user-specific operations
- Use `await auth()` in server-side code to ensure auth is complete
- Validate that data belongs to the authenticated user before returning it
- Never expose sensitive information in API responses

```typescript
// ✅ Good - Verify ownership
export async function deleteLink(
  linkId: number,
  userId: string,
): Promise<boolean> {
  const link = await db
    .select()
    .from(links)
    .where(eq(links.id, linkId));

  if (!link[0] || link[0].userId !== userId) {
    throw new Error("Unauthorized");
  }

  await db.delete(links).where(eq(links.id, linkId));
  return true;
}

// ❌ Bad - No ownership check
export async function deleteLink(linkId: number): Promise<boolean> {
  await db.delete(links).where(eq(links.id, linkId));
  return true;
}
```

### Error Handling
- Return consistent error messages
- Use appropriate HTTP status codes
- Log errors for debugging

```typescript
// ✅ Good error handling
if (!userId) {
  return NextResponse.json(
    { error: "Unauthorized" },
    { status: 401 },
  );
}

if (!link) {
  return NextResponse.json(
    { error: "Link not found" },
    { status: 404 },
  );
}
```
