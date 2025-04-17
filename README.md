# React Router v7 Monorepo

- pnpm – Monorepo package manager
- Tailwind CSS v4 – Utility-first CSS framework
- shadcn/UI – Component library
- BiomeJS – Code formatting and linting
- Vite.js – Build tool
- Lefthook – Git hooks manager
- Wrangler – Cloudflare development CLI

## Project Structure

```
react-router-v7-monorepo/
├── apps/                  # Application directory
│   └── web/               # Main Web application
│       ├── app/           # Application source code
│       │   ├── routes/    # Route definitions
│       │   └── styles/    # Style files
│       ├── public/        # Static assets
│       ├── workers/       # Cloudflare workers
│       └── ...            # App configs & scripts
├── packages/              # Shared packages
│   ├── ui/                # shadcn/ui-based reusable UI components
│   └── tsconfig/          # Centralized TypeScript config presets
├── .cursor/               # Cursor editor config & code style rules
├── .github/               # GitHub workflow config
├── biome.json             # BiomeJS config
├── lefthook.yml           # Lefthook Git hooks config
├── commitlint.config.cjs  # Commit message linting config
├── tsconfig.json          # Root TypeScript config
├── pnpm-workspace.yaml    # pnpm workspace config
└── ...                    # Other root config files
```

## Root Configuration Files

- **biome.json**: Code formatting and linting rules (BiomeJS)
- **lefthook.yml**: Git hooks for pre-commit (format, lint, typecheck) and commit-msg (commitlint)
- **commitlint.config.cjs**: Conventional commit message enforcement
- **tsconfig.json**: Extends centralized TypeScript config from `packages/tsconfig`
- **pnpm-workspace.yaml**: Declares workspace packages in `apps/*` and `packages/*`

## Getting Started

### Install dependencies
```bash
pnpm install
```

### Development
```bash
# Start all projects
dpnm dev
# Start only web app
pnpm --filter web dev
```

### Build
```bash
# Build all projects
pnpm build
# Build only web app
pnpm --filter web build
```

### Deployment
```bash
# Deploy web app to Cloudflare
pnpm --filter web wrangler:deploy
```

## Code Quality & Workflow

- **BiomeJS**: `pnpm format` (format), `pnpm check` (lint)
- **Lefthook**: Pre-commit hooks for formatting, linting, and type checking
- **Commitlint**: Enforces conventional commit messages

## License

MIT
