---
description: Read this creating or modifying UI components in the Link Shortener Project.
---

# 🎨 UI Components Guidelines

This document outlines the standards and best practices for using **shadcn/ui** components in the Link Shortener Project.

## Core Principle

**All UI elements must use shadcn/ui components.** Do not create custom components unless there is a compelling reason that cannot be solved with shadcn/ui.

## Installation & Usage

### Adding Components

When you need a component that doesn't exist yet, use the CLI:

```bash
npx shadcn-ui@latest add [component-name]
```

This adds the component to `components/ui/` and handles all styling dependencies automatically.

### Importing Components

Always import from the UI components directory:

```typescript
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
```

## Common Components

### Buttons

Use `Button` component for all interactive actions:

```typescript
import { Button } from "@/components/ui/button";

// Primary action
<Button>Click Me</Button>

// Variants
<Button variant="secondary">Secondary</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>

// With icons
<Button>
  <Trash className="w-4 h-4 mr-2" />
  Delete
</Button>

// Loading state
<Button disabled>
  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
  Loading...
</Button>
```

### Forms

Use form components for input handling:

```typescript
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

<div className="space-y-2">
  <Label htmlFor="url">Original URL</Label>
  <Input
    id="url"
    type="url"
    placeholder="https://example.com"
  />
</div>
```

### Cards

Use `Card` for content containers:

```typescript
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

<Card>
  <CardHeader>
    <CardTitle>Link Analytics</CardTitle>
  </CardHeader>
  <CardContent>
    {/* Content here */}
  </CardContent>
</Card>
```

### Dialogs & Modals

Use `Dialog` for modal interactions:

```typescript
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

<Dialog>
  <DialogTrigger asChild>
    <Button>Open</Button>
  </DialogTrigger>
  <DialogContent>
    {/* Content here */}
  </DialogContent>
</Dialog>
```

## Styling & Customization

### Using Tailwind CSS

All shadcn/ui components use Tailwind CSS. Customize appearance with Tailwind classes:

```typescript
<Button className="bg-blue-600 hover:bg-blue-700">
  Custom Button
</Button>

<Input
  className="border-2 border-green-500 focus:ring-green-600"
  placeholder="Custom input"
/>
```

### Dark Mode

Always include `dark:` prefixes for dark mode support:

```typescript
<div className="text-gray-900 dark:text-white">
  Content
</div>

<Button className="bg-white dark:bg-slate-900">
  Theme-aware Button
</Button>
```

### The `cn()` Utility

Use the `cn()` utility to merge classnames cleanly:

```typescript
import { cn } from "@/lib/utils";

interface ButtonProps {
  readonly variant?: "primary" | "secondary";
}

export function CustomButton({ variant, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "px-4 py-2 rounded font-medium",
        variant === "primary" && "bg-blue-600 text-white",
        variant === "secondary" && "bg-gray-200 text-gray-900",
      )}
      {...props}
    />
  );
}
```

## Best Practices

### ✅ Do's

- **Use semantic HTML**: Components like `Button`, `Label`, and form elements are semantic
- **Leverage props**: Use built-in props (`disabled`, `loading`, `variant`, `size`) instead of styling
- **Compose components**: Combine multiple shadcn/ui components to build complex UIs
- **Use `asChild` prop**: When you need to forward refs or use different elements:
  ```typescript
  <Button asChild>
    <a href="/dashboard">Dashboard</a>
  </Button>
  ```
- **Follow naming conventions**: Use TypeScript interfaces for props with `readonly` prefixes
- **Dark mode support**: Always add `dark:` variants to custom styles

### ❌ Don'ts

- **Don't create custom components** if shadcn/ui has what you need
- **Don't hardcode colors** - use Tailwind's color palette
- **Don't skip accessibility** - all shadcn/ui components are accessible by default
- **Don't mix styled libraries** - stick with shadcn/ui + Tailwind
- **Don't remove component structure** - the DOM structure is intentional for styling and a11y

## Component Composition Example

```typescript
// components/LinkForm.tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface LinkFormProps {
  readonly onSubmit: (url: string) => Promise<void>;
  readonly isLoading?: boolean;
}

export function LinkForm({ onSubmit, isLoading }: LinkFormProps): JSX.Element {
  const [url, setUrl] = React.useState("");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Shorten a Link</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            await onSubmit(url);
          }}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="url">URL</Label>
            <Input
              id="url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/very/long/url"
              disabled={isLoading}
            />
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Shortening..." : "Shorten"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
```

## Available Components

Run `npx shadcn-ui@latest` to see all available components, or check the [shadcn/ui documentation](https://ui.shadcn.com/docs/components).

Common components in this project:

- Button, Input, Label, Textarea
- Card, Dialog, Alert
- Tabs, Accordion
- Select, Checkbox, Radio

## When Extending Components

If you need to extend a shadcn/ui component, create a wrapper with a descriptive name:

```typescript
// components/FormInput.tsx (extension, not new component)
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  readonly error?: string;
}

export function FormInput({ error, className, ...props }: FormInputProps) {
  return (
    <div className="space-y-1">
      <Input
        className={cn(
          error && "border-red-500 focus:ring-red-500",
          className,
        )}
        {...props}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
```

---

**Last Updated**: March 2026  
**Status**: Active Development
