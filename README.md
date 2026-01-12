# universal-deploy

Deploy your Vite applications everywhere with a unified set of adapters.

## Features

- **Unified Adapters**: Deploy to multiple platforms (Node.js, Vercel, Netlify, Cloudflare) with a consistent API
- **Global Store**: Centralized registry for managing server entries and routing ([`@universal-deploy/store`](./packages/store))
- **Universal Routing**: Route matching using the [URLPattern API](https://developer.mozilla.org/en-US/docs/Web/API/URLPattern)
- **Framework Agnostic**: Works with any Vite-based framework
- **Development Support**: Built-in dev server middleware with HTML transformations

## Quick Start

```bash
# Install an adapter
pnpm add -D @universal-deploy/node
```

```typescript
// vite.config.ts
import { node } from "@universal-deploy/node/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [node()],
});
```

## Core Concepts

### Store

The [`@universal-deploy/store`](./packages/store) provides a global registry for server entries with routing:

```js
import { store } from "@universal-deploy/store";

store.entries.push({
  id: "./src/server/api.ts",
  pattern: "/api/*",
  method: "GET",
});
```

See the [store documentation](./packages/store/README.md) for full API details.

### Plugins

- **`catchAll`**: Aggregates store entries into a single `virtual:ud:catch-all` module
- **`devServer`**: Handles routing and HTML transforms during development
- **`compat`**: Auto-registers SSR rollup entries in the store

### Adapters

Adapters handle platform-specific deployment:

- **[`@universal-deploy/node`](./packages/adapter-node)**: Node.js, Bun, Deno ([README](./packages/adapter-node/README.md))
- **[`@universal-deploy/netlify`](./packages/adapter-netlify)**: Netlify deployments ([README](./packages/adapter-netlify/README.md))
- **`@universal-deploy/vercel`**: Vercel build output API
- **`@universal-deploy/cloudflare`**: Cloudflare Pages/Workers

## Examples

Explore deployment patterns in the [`examples/`](./examples) directory:

- **[`tanstack-start`](./examples/tanstack-start)**: Multi-platform TanStack Start app with compat plugin ([README](./examples/tanstack-start/README.md))
- **Minimal setups**: [`app-node`](./examples/app-node), [`app-vercel`](./examples/app-vercel), [`app-netlify`](./examples/app-netlify), [`app-cloudflare`](./examples/app-cloudflare)

## Development

```bash
pnpm install    # Install dependencies
pnpm build      # Build packages
pnpm test       # Run tests
pnpm format     # Format code
```

## License

MIT
