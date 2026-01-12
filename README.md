# universal-deploy

**Deploy your Vite app anywhere.**

TODO: explain vision: what is the goal here? From the perspective of a user, framework, and deployment provider.

As discussed at [Netlify's RFC](https://github.com/vitejs/vite/discussions/20907), this project aims to....

## Features

- **Global Store**: Register server entries ([`@universal-deploy/store`](./packages/store))
- **Universal Routing**: Route matching using [`URLPattern` standard](https://developer.mozilla.org/en-US/docs/Web/API/URLPattern)
- **Convention**: Can be adopted by any Vite-based framework

## Core Concepts

### Store

[`@universal-deploy/store`](./packages/store) provides a global registry for server entries with routing:

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

- **[`catchAll`](./packages/store/src/vite/catch-all.ts)**: Aggregates server entries into a single `virtual:ud:catch-all` module
- **[`devServer`](./packages/store/src/vite/dev-server.ts)**: Handles routing and HTML transforms during development
- **[`compat`](./packages/store/src/vite/rollup-entries-compat.ts)**: Auto-registers SSR rollup entries in the store (for Vite-based frameworks that didn't adopt `universal-deploy` yet)

### Adapters

TODO:
- Explain the goal of these packages
- Add link to `vite-plugin-vercel@beta` ?

Adapters handle platform-specific deployment:

- **[`@universal-deploy/node`](./packages/adapter-node)** (Node.js, Bun, Deno)
- **[`@universal-deploy/netlify`](./packages/adapter-netlify)**
- **`vite-plugin-vercel@beta`** (uses Vercel build output API)
- **`@cloudflare/vite-plugin`** (already compatible)

## Examples

- **[`examples/tanstack-start`](./examples/tanstack-start)**: TanStack Start app deployed to Netlify, Cloudflare, Vercel, or Node.js/Bun/Deno.
- **Minimal examples**: [`examples/app-node`](./examples/app-node), [`examples/app-vercel`](./examples/app-vercel), [`examples/app-netlify`](./examples/app-netlify), [`examples/app-cloudflare`](./examples/app-cloudflare)

## License

MIT
