# universal-deploy

Deploy your Vite applications everywhere with a unified set of adapters.

## Features

- **Unified Adapters**: Deploy to multiple platforms (Node.js, Vercel, Netlify, Cloudflare) with a consistent API
- **Global Store**: Centralized registry for managing server entries and routing ([`@universal-deploy/store`](./packages/store))
- **Universal Routing**: Route matching using the [URLPattern API](https://developer.mozilla.org/en-US/docs/Web/API/URLPattern)
- **Framework Agnostic**: Works with any Vite-based framework
- **Development Support**: Built-in dev server middleware with HTML transformations

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

- **[`catchAll`](./packages/store/src/vite/catch-all.ts)**: Aggregates store entries into a single `virtual:ud:catch-all` module
- **[`devServer`](./packages/store/src/vite/dev-server.ts)**: Handles routing and HTML transforms during development
- **[`compat`](./packages/store/src/vite/rollup-entries-compat.ts)**: Auto-registers SSR rollup entries in the store

### Adapters

Adapters handle platform-specific deployment:

- **[`@universal-deploy/node`](./packages/adapter-node)**: Node.js, Bun, Deno ([README](./packages/adapter-node/README.md))
- **[`@universal-deploy/netlify`](./packages/adapter-netlify)**: Netlify deployments ([README](./packages/adapter-netlify/README.md))
- **`vite-plugin-vercel@beta`**: Vercel build output API
- **`@cloudflare/vite-plugin`**: Already compatible through `wrangler.jsonc`

## Examples

Explore deployment patterns in the [`examples/`](./examples) directory:

- **[`tanstack-start`](./examples/tanstack-start)**: Multi-platform TanStack Start app with compat plugin ([README](./examples/tanstack-start/README.md))
- **Minimal setups**: [`app-node`](./examples/app-node), [`app-vercel`](./examples/app-vercel), [`app-netlify`](./examples/app-netlify), [`app-cloudflare`](./examples/app-cloudflare)

## License

MIT
