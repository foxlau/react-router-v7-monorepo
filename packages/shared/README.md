# @workspace/shared

Shared utilities, hooks, types, and assets for use across multiple applications in the monorepo.

## Features

- Common utility functions
- Reusable React hooks
- TypeScript type definitions
- Shared configuration values
- Shared assets (images, icons, etc.)

## Usage

### Import Utilities

```typescript
// Recommended: Import from module index
import { formatDate } from '@workspace/shared/utils';
```

### Use Hooks

```typescript
// Recommended: Import from module index
import { useLocalStorage, useNonce, NonceProvider } from '@workspace/shared/hooks';
```

### Use Type Definitions

```typescript
// Recommended: Import from module index
import type { User } from '@workspace/shared/types';
```

### Access Configuration

```typescript
// Recommended: Import from module index
import { APP_CONFIG } from '@workspace/shared/config';
import { THEME_OPTIONS } from '@workspace/shared/constants';
```

### Use Assets

```typescript
// Recommended: Import from module index
import { Logo, LogoDark } from '@workspace/shared/assets';

// Alternative: Import asset file directly (if build tool configured correctly)
import Logo from '@workspace/shared/assets/logo.svg';
```

## Directory Structure

```
packages/shared/
├── src/
│   ├── assets/     # Shared static assets
│   │   └── index.ts  # Asset constants and exports
│   ├── config/     # Configuration files
│   │   └── app.ts    # App configuration
│   │   └── index.ts  # Config exports
│   ├── constants/  # Constant values
│   │   └── theme.ts  # Theme constants
│   │   └── index.ts  # Constants exports
│   ├── hooks/      # React hooks (kebab-case)
│   │   ├── use-local-storage.ts
│   │   ├── use-nonce.ts
│   │   └── index.ts  # Hooks exports
│   ├── types/      # TypeScript type definitions
│   │   ├── user.ts   # User-related types
│   │   └── index.ts  # Types exports
│   └── utils/      # Utility functions
│       ├── date.ts   # Date utilities
│       └── index.ts  # Utils exports
├── package.json
├── tsconfig.json
└── README.md
```

## File Naming Conventions

- React hooks: kebab-case with `use-` prefix (e.g., `use-local-storage.ts`)
- Utility functions: camelCase (e.g., `date.ts`)
- Type definitions: camelCase (e.g., `user.ts`)
- Constants: UPPER_SNAKE_CASE for the constants, camelCase for the files (e.g., `theme.ts`)
- Config files: camelCase (e.g., `app.ts`)