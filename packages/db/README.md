# @workspace/db

Database package that provides integration between Drizzle ORM and Cloudflare D1 database.

## Features

- Define database schema
- Handle database migrations
- Manage Cloudflare D1 database

## Tech Stack

- **Drizzle ORM**: SQL-first ORM with type-safe database operations
- **Cloudflare D1**: SQLite-based edge database for Cloudflare
- **Wrangler**: Cloudflare development CLI tool

## Usage

### Creating or Updating Database Schema

Define database schemas in the `src/schema` directory. This package currently includes:
- `users.ts`: User table definition
- `todos.ts`: Todo items table definition

### Generate Migration Files

When you modify the schema, you need to generate migration files:

```bash
pnpm db:generate
```

### Apply Migrations

Apply migrations to local development environment:

```bash
pnpm db:apply
```

Apply migrations to production environment:

```bash
pnpm db:apply-prod
```

Apply migrations to preview environment:

```bash
pnpm db:apply-preview
```

### Drop All Tables (Use with Caution)

```bash
pnpm db:drop
```

## Database Structure

The database currently contains the following tables:

- `users`: User information
- `todos`: Todo items

## Import and Usage

Import the database tables in other packages:

```typescript
import { usersTable, todosTable } from "@workspace/db";
```

## Deployment

Deployment is done using the Wrangler CLI.

```bash
# Create a new D1 database
npx wrangler d1 create rrv7-monorepo
```

To deploy directly to production:

```bash
pnpm db:apply-prod
pnpm deploy
```

To deploy a preview URL:

```bash
pnpm deploy:version
```

You can then promote a version to production after verification or roll it out progressively:

```bash
pnpm deploy:promote
```
