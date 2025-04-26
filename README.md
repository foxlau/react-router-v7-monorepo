# React Router v7 Monorepo

This is a streamlined example demonstrating the use of React Router v7 within a monorepo, integrating Cloudflare Workers, Drizzle ORM with D1, Shadcn/UI, and Tailwind CSS v4.

## Features

- 📦 pnpm – Monorepo package manager
- 🎨 Tailwind CSS v4 – Utility-first CSS framework
- 🧩 shadcn/UI – Component library
- 🔍 BiomeJS – Code formatting and linting
- ⚡ Vite.js – Build tool
- 🪝 Lefthook – Git hooks manager
- 🔧 Wrangler – Cloudflare development CLI
- 🗃️ Drizzle ORM – SQL-first ORM
- 🌩️ Cloudflare D1 – SQLite database for Cloudflare Workers

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
│   ├── db/                # Drizzle ORM + Cloudflare D1 database
│   ├── shared/            # Common utilities, hooks, and assets
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
# For apps/web, copy configuration files first
cd apps/web
cp .dev.vars.example .dev.vars
cp wrangler.jsonc.example wrangler.jsonc
cd ../..

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

## Database & Deployment

The project uses Drizzle ORM with Cloudflare D1 (SQLite) for database operations and Wrangler CLI for deployment.

### Database Setup & Management

```bash
# Create a new D1 database
npx wrangler d1 create rrv7-monorepo

# Generate migration files from schema changes
pnpm db:generate

# Apply migrations locally
pnpm db:apply

# Drop all tables (caution!)
pnpm db:drop
```

### Deployment

```bash
# Apply migrations and deploy to production
pnpm db:apply-prod
pnpm deploy

# Deploy a preview version for testing
pnpm deploy:version

# Promote a version to production
pnpm deploy:promote
```

## Code Quality & Workflow

- **BiomeJS**: `pnpm format` (format), `pnpm check` (lint)
- **Lefthook**: Pre-commit hooks for formatting, linting, and type checking
- **Commitlint**: Enforces conventional commit messages

## License

MIT
