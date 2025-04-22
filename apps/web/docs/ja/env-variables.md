[ドキュメントに戻る](../README.md)

# 環境変数管理

このプロジェクトでは、環境変数を2つのカテゴリに分け、最適な型安全性と開発者体験のために異なる方法で管理します。

## 環境変数のカテゴリ

1. **設定変数**: `env.server.ts` を通じて検証される単純な文字列/数値/ブール値
2. **Cloudflare バインディング**: DB、KV、DOなどの複雑なオブジェクトで、`cloudflare:workers` 経由で直接アクセスされます

## 設定変数

これらは `env.server.ts` 内の Zod で管理され、存在し、正しい形式であることを保証します:

```typescript
// env.server.ts からインポート
import { env } from "~/lib/env.server";

// 検証済みの環境変数を使用
env.VALUE_FROM_CLOUDFLARE
env.ENVIRONMENT
```

## Cloudflare バインディング

複雑なバインディングには直接アクセスする必要があります:

```typescript
// Cloudflare env を直接インポート
import { env } from "cloudflare:workers";

// バインディングに直接アクセス
const db = env.DB;
const kv = env.KV_NAMESPACE;
```

### なぜこのアプローチか？

この分離にはいくつかの利点があります:
1. **明確な責任分担**: 設定変数は Zod で堅牢なランタイム検証を受け、バインディングは Cloudflare の組み込み型システムを使用します
2. **直接アクセス**: バインディングはミドルウェアを経由せずに直接インポートできます
3. **将来の互換性**: Cloudflare が推奨するバインディングへのアクセスアプローチに従います
4. **型安全性**: バインディングには Cloudflare のネイティブ型定義を使用します

## 環境変数の設定

Cloudflare Workers では、環境変数は以下の方法で設定できます:

### 1. ローカル開発環境 (.dev.vars)

ローカル開発では `.dev.vars` ファイルを使用します:

```
ENVIRONMENT = "development"
VALUE_FROM_CLOUDFLARE = "Hello from Cloudflare"
```

### 2. Wrangler 設定 (wrangler.jsonc)

異なる環境へのデプロイメントでは、`wrangler.jsonc` (または `.jsonc`) で設定します:

```jsonc
{
  // グローバル環境変数 (全環境で共有)
  "vars": {
    "ENVIRONMENT": "production"
  },
  // 環境固有の設定
  "env": {
    "preview": {
      // プレビュー環境変数
      "vars": {
        "ENVIRONMENT": "preview",
        "VALUE_FROM_CLOUDFLARE": "Hello from Cloudflare (Preview)"
      }
      // 他のプレビュー固有設定 (バインディングなど) はここに追加可能
    }
    // 他の環境 (例: "production") はここで定義可能
  }
  // ... 他の設定 (name, main, compatibility_date など)
}
```

### 3. Cloudflare ダッシュボード

Cloudflare ダッシュボードで各環境の環境変数を設定できます。

### 4. データベースとバインディング

データベースやその他のバインディングは `wrangler.jsonc` で設定する必要があります:

```jsonc
{
  "d1_databases": [
    {
      "binding": "DB", // コード内でバインディングにアクセスする方法 (env.DB)
      "database_name": "your-database-name", // D1 データベースの名前
      "database_id": "your-database-id" // D1 データベース ID
    }
  ]
  // ... 他の設定
}
```

## 環境変数の例

```
# アプリケーション環境
ENVIRONMENT=development

# 例の値
VALUE_FROM_CLOUDFLARE="Hello from Cloudflare"

# データベースバインディングは Cloudflare コンソールまたは wrangler.jsonc で設定
```

## 新しい環境変数の追加

新しい環境変数を追加するには:

1. 設定値 (文字列、数値など) の場合:
   - `env.server.ts` ファイルの `serverEnvSchema` を更新します
   - 新しい変数に適した Zod 検証ルールを追加します

2. Cloudflare バインディング (DB、KVなど) の場合:
   - `wrangler.jsonc` で設定します
   - `import { env } from "cloudflare:workers"` を介して直接アクセスします

3. 対応する変数の値を `.dev.vars` と `wrangler.jsonc` に追加します

4. アプリケーションを再デプロイします

## ヘルパー関数の使用

プロジェクトは環境変数を扱うためのヘルパー関数を提供します:

```typescript
// 環境ユーティリティをインポート
import { env, isDevelopment, isPreview, isProduction } from "~/lib/env.server";

// 便利なエクスポートを使用して環境を確認
if (isDevelopment) {
  console.log("開発モードで実行中");
}

// 検証済みの環境変数にアクセス
const value = env.VALUE_FROM_CLOUDFLARE;
```

## Cloudflare バインディングの検証（オプション）

バインディングに直接アクセスすることをお勧めしますが、必要であれば `env.server.ts` でその存在を検証することも可能です:

```typescript
// env.server.ts 内
const serverEnvSchema = z.object({
  // 通常の環境変数
  ENVIRONMENT: z.enum(["development", "preview", "production"]).default("development"),

  // Cloudflare バインディング検証 (存在のみチェック)
  DB: z.custom<D1Database>((value) => value != null, {
    message: "DB データベースバインディングが見つからないか、無効です",
  }),
  KV_NAMESPACE: z.custom<KVNamespace>((value) => value != null, {
    message: "KV_NAMESPACE バインディングが見つからないか、無効です",
  }),
});
```

このアプローチはバインディングが存在することを保証しますが、実際の使用には `cloudflare:workers` 経由で直接アクセスすることを依然としてお勧めします。

## クライアントサイドの環境アクセス

選択した環境変数をクライアントに公開するには、`getPublicEnv()` 関数を使用します:

```typescript
// env.server.ts 内
export function getPublicEnv() {
  return {
    MODE: env.ENVIRONMENT,
    VALUE_FROM_CLOUDFLARE: env.VALUE_FROM_CLOUDFLARE,
    // ここに安全に公開できる他の公開変数を追加...
  };
}
```

この関数は、ブラウザに安全に公開できる変数をフィルタリングします。

### クライアントコンポーネントでの環境変数のアクセス

クライアントコンポーネントで環境変数にアクセスするには、推奨される2つの方法があります:

1. **`root.tsx` で `useLoaderData` を使用する**:
   ```tsx
   // root.tsx 内
   import { useLoaderData } from "react-router";

   export function loader() {
     return {
       ENV: getPublicEnv(),
     };
   }

   function SomeRootComponent() {
     const data = useLoaderData<typeof loader>();
     const { ENV } = data;

     // これで ENV.MODE、ENV.VALUE_FROM_CLOUDFLARE などが使用可能
   }
   ```

2. **他のコンポーネントで `useRouteLoaderData` を使用する**:
   ```tsx
   // 任意のコンポーネント内
   import { useRouteLoaderData } from "react-router";

   function SomeComponent() {
     // ルート ID でルートローダーデータにアクセス
     const data = useRouteLoaderData<{ ENV: Record<string, string> }>("root");

     // これで data.ENV.MODE、data.ENV.VALUE_FROM_CLOUDFLARE などが使用可能
     return <div>{data.ENV.MODE} モードで実行中</div>;
   }
   ```

このアプローチは型安全であり、React コンポーネント全体で一貫して環境変数にアクセスできます。

## Cloudflare 環境アクセスリファレンス

Cloudflare は環境変数にアクセスする複数の方法を提供します:

1. **`cloudflare:workers` の使用（推奨）** - [env ドキュメント](https://developers.cloudflare.com/changelog/2025-03-17-importable-env/)
   ```typescript
   import { env } from "cloudflare:workers";
   ```
   このメソッドを使用すると、`env` をパラメータとして渡すことなく、コード内のどこからでもすべてのバインディングにアクセスできます。

2. **`process.env` の使用（Node.js 互換性）** - [process.env サポートドキュメント](https://developers.cloudflare.com/changelog/2025-03-11-process-env-support/)
   ```typescript
   const apiKey = process.env.API_KEY;
   ```
   このアプローチは、`nodejs_compat_populate_process_env` 互換フラグを使用している場合に利用可能で、主に Node.js との互換性のためのものです。

このプロジェクトでは、設定変数の Zod 検証と組み合わせて、バインディングへの直接アクセスのために `cloudflare:workers` アプローチを使用しています。