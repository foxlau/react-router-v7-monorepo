# @workspace/ui

A collection of reusable UI components for Frontree projects, built with Radix UI, styled with Tailwind CSS, and powered by [shadcn/ui](https://ui.shadcn.com/).

## Installation

Since this is a workspace package, you can reference it directly in your project:

```json
{
  "dependencies": {
    "@workspace/ui": "workspace:*"
  }
}
```

## Add components to your project

To add components to your project, run the add command in the path of your app.

```sh
cd apps/web
pnpm dlx shadcn@canary add [COMPONENT]
```

The CLI will detect the type of component and install the correct files to the correct path.

For example:

- `pnpm dlx shadcn@canary add button`
  Installs the button component under `packages/ui` and updates the import path for components in `apps/web`.

- `pnpm dlx shadcn@canary add login-01`
  Installs the button, label, input, and card components under `packages/ui`, and the login-form component under `apps/web/components`.

## Usage

### Components

```tsx
import { Button } from "@workspace/ui/components/button";
import { Dialog } from "@workspace/ui/components/dialog";

function MyComponent() {
  return (
    <Dialog>
      <Dialog.Trigger asChild>
        <Button>Open Dialog</Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>Dialog Title</Dialog.Title>
          <Dialog.Description>Dialog description goes here.</Dialog.Description>
        </Dialog.Header>
        <div className="p-4">Dialog content</div>
        <Dialog.Footer>
          <Button>Close</Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  );
}
```

### Hooks

```tsx
import { useIsMobile } from "@workspace/ui/hooks/use-mobile";

function ResponsiveComponent() {
  const isMobile = useIsMobile();

  return (
    <div>
      {isMobile ? (
        <p>Mobile view</p>
      ) : (
        <p>Desktop view</p>
      )}
    </div>
  );
}
```

### Styles

```tsx
// In your main CSS file
import "@workspace/ui/globals.css";
```

### Utility Functions

```tsx
import { cn } from "@workspace/ui/lib/utils";

function MyComponent({ className }) {
  return (
    <div className={cn("base-styles", className)}>
      Content
    </div>
  );
}
```