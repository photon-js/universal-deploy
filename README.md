TODO:
- add readme to each examples/* explaining what it's showing exactly (at first I was looking for a server entry but I finally realized that the server is implemented by `awesomeFramework`. So I guess explain that the mininal examples show how AwesomeFramework is deployed.
- Show how AwesomeFramework integrates with UD?

# universal-deploy

**Deploy your Vite app anywhere.**

## Goal

As discussed at [Netlify's RFC](https://github.com/vitejs/vite/discussions/20907), this POC aims to solve the issue pinpointed by point 3, i.e. "Routing metadata".
Mostly, how can a deployment target (Netlify, Cloudflare, Node, etc.) find and use the different server entries defined by a framework (or user)?
This POC demonstrates that we can solve this issue with a minimal API.

## Features

- **Global Store**: Register server entries ([`@universal-deploy/store`](./packages/store))
- **Universal Routing**: Via the [`URLPattern` standard](https://developer.mozilla.org/en-US/docs/Web/API/URLPattern)
- **Minimal conventions**: Can easily be adopted by any Vite-based framework

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

The following Vite plugins help frameworks and deployment providers to works with the global entries store.

- **[`devServer`](./packages/store/src/vite/dev-server.ts)**: Can be used by a framework during development to route requests to the entries defined in the global store
- **[`compat`](./packages/store/src/vite/rollup-entries-compat.ts)**: Auto-registers SSR rollup entries in the store (for Vite-based frameworks that didn't adopt `universal-deploy` yet)
- **[`catchAll`](./packages/store/src/vite/catch-all.ts)**: Utility plugin that aggregates and routes all global store entries behind a unique entry. Used by `devServer`, `compat` and node target

### Adapters

TODO:
- Explain the goal of the `@universal-deploy` packages. They are temporary, very important.
- Add link to `vite-plugin-vercel@beta` ?

Here are some temporary packages that demonstrate how deployment plugins can integrate `@universal-deploy/store`.
Packages like `@universal-deploy/netlify` will no longer be required once directly supported by Vite deployment plugins (e.g. `@netlify/vite-plugin`).

- **[`@universal-deploy/node`](./packages/adapter-node)** (Node.js, Bun, Deno)
- **[`@universal-deploy/netlify`](./packages/adapter-netlify)**
- **[`vite-plugin-vercel@beta`](https://github.com/magne4000/vite-plugin-vercel/pull/207)** (uses Vercel build output API)
- **`@cloudflare/vite-plugin`** (already compatible)

## Examples

- **[`examples/tanstack-start`](./examples/tanstack-start)**: TanStack Start app deployed to Netlify, Cloudflare, Vercel, or Node.js/Bun/Deno.
- **Minimal examples**: [`examples/app-node`](./examples/app-node), [`examples/app-vercel`](./examples/app-vercel), [`examples/app-netlify`](./examples/app-netlify), [`examples/app-cloudflare`](./examples/app-cloudflare)

## License

MIT
