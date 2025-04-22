[返回文档](../README.md)

# 环境变量管理

本项目将环境变量分为两类，并采用不同的管理方式，以获得最佳的类型安全性和开发体验。

## 环境变量分类

1. **配置变量**：简单的字符串/数字/布尔值，通过 `env.server.ts` 验证
2. **Cloudflare 绑定**：复杂对象如 DB、KV、DO 等，通过 `cloudflare:workers` 直接访问

## 配置变量

这些变量通过 `env.server.ts` 中的 Zod 进行管理，确保它们存在且格式正确：

```typescript
// 从 env.server.ts 导入
import { env } from "~/lib/env.server";

// 使用验证后的环境变量
env.VALUE_FROM_CLOUDFLARE
env.ENVIRONMENT
```

## Cloudflare 绑定

复杂绑定应该直接访问：

```typescript
// 直接导入 Cloudflare 环境
import { env } from "cloudflare:workers";

// 直接访问绑定
const db = env.DB;
const kv = env.KV_NAMESPACE;
```

### 为什么采用这种方式？

这种分离提供了几个好处：
1. **职责明确**：配置变量通过 Zod 获得强大的运行时验证，而绑定则使用 Cloudflare 的内置类型系统
2. **直接访问**：绑定可以直接导入，无需通过中间件
3. **未来兼容性**：遵循 Cloudflare 推荐的绑定访问方式
4. **类型安全**：使用 Cloudflare 原生类型定义来处理绑定

## 环境变量配置

在 Cloudflare Workers 中，环境变量可以通过以下方式配置：

### 1. 本地开发环境 (.dev.vars)

对于本地开发，使用 `.dev.vars` 文件：

```
ENVIRONMENT = "development"
VALUE_FROM_CLOUDFLARE = "Hello from Cloudflare"
```

### 2. Wrangler 配置 (wrangler.jsonc)

对于不同环境的部署，在 `wrangler.jsonc` (或 `.jsonc`) 中配置：

```jsonc
{
  // 全局环境变量（所有环境共享）
  "vars": {
    "ENVIRONMENT": "production"
  },
  // 环境特定配置
  "env": {
    "preview": {
      // 预览环境特定变量
      "vars": {
        "ENVIRONMENT": "preview",
        "VALUE_FROM_CLOUDFLARE": "Hello from Cloudflare (Preview)"
      }
      // 其他预览环境特定设置（如绑定）可在此处添加
    }
    // 其他环境（如 "production"）可在此处定义
  }
  // ... 其他配置项，如 name, main, compatibility_date 等
}
```

### 3. Cloudflare Dashboard

在 Cloudflare Dashboard 中，可以为每个环境设置环境变量。

### 4. 数据库和绑定

数据库和其他绑定需要在 `wrangler.jsonc` 中配置：

```jsonc
{
  "d1_databases": [
    {
      "binding": "DB", // 在代码中访问绑定的名称 (env.DB)
      "database_name": "your-database-name", // D1 数据库的名称
      "database_id": "your-database-id" // D1 数据库的 ID
    }
  ]
  // ... 其他配置
}
```

## 示例环境变量

```
# 应用环境
ENVIRONMENT=development

# 示例值
VALUE_FROM_CLOUDFLARE="Hello from Cloudflare"

# 数据库绑定在 Cloudflare 控制台或 wrangler.jsonc 中配置
```

## 添加新的环境变量

要添加新的环境变量：

1. 对于配置值（字符串、数字等）：
   - 在 `env.server.ts` 文件中更新 `serverEnvSchema`
   - 为新变量添加适当的 Zod 验证规则

2. 对于 Cloudflare 绑定（DB、KV 等）：
   - 在 `wrangler.jsonc` 中配置它们
   - 通过 `import { env } from "cloudflare:workers"` 直接访问它们

3. 在 `.dev.vars` 和 `wrangler.jsonc` 中添加对应的变量值

4. 重新部署应用

## 使用辅助函数

项目提供了环境变量工作的辅助函数：

```typescript
// 导入环境工具
import { env, isDevelopment, isPreview, isProduction } from "~/lib/env.server";

// 使用便捷导出检查环境
if (isDevelopment) {
  console.log("在开发模式下运行");
}

// 访问验证过的环境变量
const value = env.VALUE_FROM_CLOUDFLARE;
```

## 验证 Cloudflare 绑定（可选）

虽然我们建议直接访问绑定，但如果需要，您仍然可以在 `env.server.ts` 中验证它们的存在：

```typescript
// 在 env.server.ts 中
const serverEnvSchema = z.object({
  // 常规环境变量
  ENVIRONMENT: z.enum(["development", "preview", "production"]).default("development"),

  // Cloudflare 绑定验证（仅检查是否存在）
  DB: z.custom<D1Database>((value) => value != null, {
    message: "DB 数据库绑定缺失或无效",
  }),
  KV_NAMESPACE: z.custom<KVNamespace>((value) => value != null, {
    message: "KV_NAMESPACE 绑定缺失或无效",
  }),
});
```

这种方法确保绑定存在，但我们仍然建议通过 `cloudflare:workers` 直接访问它们进行实际使用。

## 客户端环境访问

要向客户端公开选定的环境变量，请使用 `getPublicEnv()` 函数：

```typescript
// 在 env.server.ts 中
export function getPublicEnv() {
  return {
    MODE: env.ENVIRONMENT,
    VALUE_FROM_CLOUDFLARE: env.VALUE_FROM_CLOUDFLARE,
    // 在此处添加其他可以安全暴露的公共变量...
  };
}
```

此函数筛选哪些变量可以安全地暴露给浏览器。

### 在客户端组件中访问环境变量

有两种推荐的方式在客户端组件中访问环境变量：

1. **在 `root.tsx` 中使用 `useLoaderData`**：
   ```tsx
   // 在 root.tsx 中
   import { useLoaderData } from "react-router";

   export function loader() {
     return {
       ENV: getPublicEnv(),
     };
   }

   function SomeRootComponent() {
     const data = useLoaderData<typeof loader>();
     const { ENV } = data;

     // 现在你可以使用 ENV.MODE, ENV.VALUE_FROM_CLOUDFLARE 等
   }
   ```

2. **在其他组件中使用 `useRouteLoaderData`**：
   ```tsx
   // 在任何组件中
   import { useRouteLoaderData } from "react-router";

   function SomeComponent() {
     // 通过路由 ID 访问 root loader 数据
     const data = useRouteLoaderData<{ ENV: Record<string, string> }>("root");

     // 现在你可以使用 data.ENV.MODE, data.ENV.VALUE_FROM_CLOUDFLARE 等
     return <div>在 {data.ENV.MODE} 模式下运行</div>;
   }
   ```

这种方法是类型安全的，并允许你在 React 组件中一致地访问环境变量。

## Cloudflare 环境访问参考

Cloudflare 提供了多种访问环境变量的方式：

1. **使用 `cloudflare:workers`（推荐）** - [env文档](https://developers.cloudflare.com/changelog/2025-03-17-importable-env/)
   ```typescript
   import { env } from "cloudflare:workers";
   ```
   此方法允许从代码中的任何位置访问所有绑定，而无需将 `env` 作为参数传递。

2. **使用 `process.env`（Node.js 兼容性）** - [process.env 支持文档](https://developers.cloudflare.com/changelog/2025-03-11-process-env-support/)
   ```typescript
   const apiKey = process.env.API_KEY;
   ```
   此方法在使用 `nodejs_compat_populate_process_env` 兼容性标志时可用，主要用于 Node.js 兼容性。

我们的项目使用 `cloudflare:workers` 方法直接访问绑定，结合 Zod 验证配置变量。