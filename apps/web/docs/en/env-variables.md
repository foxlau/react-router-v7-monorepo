[Back to Documentation](../README.md)

# Environment Variable Management

This project separates environment variables into two categories and manages them differently for optimal type safety and developer experience.

## Environment Variable Categories

1. **Configuration Variables**: Simple string/number/boolean values validated through `env.server.ts`
2. **Cloudflare Bindings**: Complex objects like DB, KV, DO, etc. accessed directly via `cloudflare:workers`

## Configuration Variables

These are managed with Zod in `env.server.ts` to ensure they exist and have the correct format:

```typescript
// Import from env.server.ts
import { env } from "~/lib/env.server";

// Use the validated environment variables
env.VALUE_FROM_CLOUDFLARE
env.ENVIRONMENT
```

## Cloudflare Bindings

Complex bindings should be accessed directly:

```typescript
// Import Cloudflare env directly
import { env } from "cloudflare:workers";

// Access bindings directly
const db = env.DB;
const kv = env.KV_NAMESPACE;
```

### Why This Approach?

This separation provides several benefits:
1. **Clear Responsibilities**: Configuration variables get robust runtime validation with Zod, while bindings use Cloudflare's built-in type system
2. **Direct Access**: Bindings can be imported directly without passing through middleware
3. **Future Compatibility**: Follows Cloudflare's recommended approach for accessing bindings
4. **Type Safety**: Uses Cloudflare's native type definitions for bindings

## Environment Variable Configuration

In Cloudflare Workers, environment variables can be configured in the following ways:

### 1. Local Development Environment (.dev.vars)

For local development, use the `.dev.vars` file:

```
ENVIRONMENT = "development"
VALUE_FROM_CLOUDFLARE = "Hello from Cloudflare"
```

### 2. Wrangler Configuration (wrangler.jsonc)

For deployments across different environments, configure in `wrangler.jsonc` (or `.jsonc`):

```jsonc
{
  // Global environment variables (shared across all environments)
  "vars": {
    "ENVIRONMENT": "production"
  },
  // Environment-specific configuration
  "env": {
    "preview": {
      // Preview environment variables
      "vars": {
        "ENVIRONMENT": "preview",
        "VALUE_FROM_CLOUDFLARE": "Hello from Cloudflare (Preview)"
      }
      // other preview-specific settings like bindings can go here
    }
    // other environments like "production" can be defined here
  }
  // ... other config like name, main, compatibility_date, etc.
}
```

### 3. Cloudflare Dashboard

Environment variables can be set for each environment in the Cloudflare Dashboard.

### 4. Database and Bindings

Database and other bindings need to be configured in `wrangler.jsonc`:

```jsonc
{
  "d1_databases": [
    {
      "binding": "DB", // How the binding is accessed in your code (env.DB)
      "database_name": "your-database-name", // Name of the D1 database
      "database_id": "your-database-id" // The D1 database ID
    }
  ]
  // ... other config
}
```

## Example Environment Variables

```
# Application Environment
ENVIRONMENT=development

# Example Value
VALUE_FROM_CLOUDFLARE="Hello from Cloudflare"

# Database binding configured in Cloudflare console or wrangler.jsonc
```

## Adding New Environment Variables

To add new environment variables:

1. For configuration values (strings, numbers, etc.):
   - Update the `serverEnvSchema` in the `env.server.ts` file
   - Add appropriate Zod validation rules for the new variable

2. For Cloudflare bindings (DB, KV, etc.):
   - Configure them in `wrangler.jsonc`
   - Access them directly via `import { env } from "cloudflare:workers"`

3. Add the corresponding variable values in `.dev.vars` and `wrangler.jsonc`

4. Redeploy the application

## Using Helper Functions

The project provides helper functions for working with environment variables:

```typescript
// Import environment utilities
import { env, isDevelopment, isPreview, isProduction } from "~/lib/env.server";

// Use convenience exports to check environment
if (isDevelopment) {
  console.log("Running in development mode");
}

// Access validated environment variables
const value = env.VALUE_FROM_CLOUDFLARE;
```

## Validating Cloudflare Bindings (Optional)

Although we recommend accessing bindings directly, you can still validate their existence in `env.server.ts` if needed:

```typescript
// In env.server.ts
const serverEnvSchema = z.object({
  // Regular environment variables
  ENVIRONMENT: z.enum(["development", "preview", "production"]).default("development"),

  // Cloudflare bindings validation (only checks existence)
  DB: z.custom<D1Database>((value) => value != null, {
    message: "DB database binding is missing or invalid",
  }),
  KV_NAMESPACE: z.custom<KVNamespace>((value) => value != null, {
    message: "KV_NAMESPACE binding is missing or invalid",
  }),
});
```

This approach ensures the bindings exist but we still recommend accessing them directly via `cloudflare:workers` for actual usage.

## Client-Side Environment Access

To expose selected environment variables to the client, use the `getPublicEnv()` function:

```typescript
// In env.server.ts
export function getPublicEnv() {
  return {
    MODE: env.ENVIRONMENT,
    VALUE_FROM_CLOUDFLARE: env.VALUE_FROM_CLOUDFLARE,
    // Add other public variables here that are safe to expose...
  };
}
```

This function filters which variables are safe to expose to the browser.

### Accessing Environment Variables in Client Components

There are two recommended ways to access environment variables in client components:

1. **In `root.tsx` using `useLoaderData`**:
   ```tsx
   // In root.tsx
   import { useLoaderData } from "react-router";

   export function loader() {
     return {
       ENV: getPublicEnv(),
     };
   }

   function SomeRootComponent() {
     const data = useLoaderData<typeof loader>();
     const { ENV } = data;

     // Now you can use ENV.MODE, ENV.VALUE_FROM_CLOUDFLARE etc.
   }
   ```

2. **In other components using `useRouteLoaderData`**:
   ```tsx
   // In any component
   import { useRouteLoaderData } from "react-router";

   function SomeComponent() {
     // Access the root loader data by route ID
     const data = useRouteLoaderData<{ ENV: Record<string, string> }>("root");

     // Now you can use data.ENV.MODE, data.ENV.VALUE_FROM_CLOUDFLARE etc.
     return <div>Running in {data.ENV.MODE} mode</div>;
   }
   ```

This approach is type-safe and allows you to access environment variables consistently across your React components.

## Cloudflare Environment Access References

Cloudflare offers multiple ways to access environment variables:

1. **Using `cloudflare:workers` (Recommended)** - [env documentation](https://developers.cloudflare.com/changelog/2025-03-17-importable-env/)
   ```typescript
   import { env } from "cloudflare:workers";
   ```
   This method allows accessing all bindings from anywhere in your code without passing `env` as a parameter.

2. **Using `process.env` (Node.js Compatibility)** - [process.env support documentation](https://developers.cloudflare.com/changelog/2025-03-11-process-env-support/)
   ```typescript
   const apiKey = process.env.API_KEY;
   ```
   This approach is available when using the `nodejs_compat_populate_process_env` compatibility flag and is primarily for Node.js compatibility.

Our project uses the `cloudflare:workers` approach for direct access to bindings, combined with Zod validation for configuration variables.