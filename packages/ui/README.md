# @workspace/ui

A collection of reusable UI components for Frontree projects, built with Radix UI and styled with Tailwind CSS.

## Installation

Since this is a workspace package, you can reference it directly in your project:

```json
{
  "dependencies": {
    "@workspace/ui": "workspace:*"
  }
}
```

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