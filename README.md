# universal-deploy

*Deploying Vite apps anywhere.*

## Goal

As discussed at [Netlify's RFC](https://github.com/vitejs/vite/discussions/20907), this POC aims to solve the issue pinpointed by point 1 and 3, i.e. "Server entry point location" and "Routing metadata".
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

### Vite Plugins

The following Vite plugins help frameworks and deployment providers work with the global entries store.

- **[`compat`](./packages/store/src/vite/rollup-entries-compat.ts)**: Auto-registers SSR rollup entries in the store (for Vite-based frameworks that didn't adopt `universal-deploy` yet).
- **[`catchAll`](./packages/store/src/vite/catch-all.ts)**: Utility plugin that aggregates and routes all global store entries behind a unique entry. Used by `devServer`, `compat` and node target.
- **[`devServer`](./packages/store/src/vite/dev-server.ts)**: Can be used by a framework during development to route requests to the entries defined in the global store.

### Adapters

Temporary packages that demonstrate how deployment plugins can integrate `@universal-deploy/store`.
Packages like `@universal-deploy/netlify` will no longer be required once directly supported by Vite deployment plugins (e.g. `@netlify/vite-plugin`).

- **[`@universal-deploy/netlify`](./packages/adapter-netlify)**
- **[`@universal-deploy/node`](./packages/adapter-node)** (Node.js, Bun, Deno)

Already compatible:

- **`@cloudflare/vite-plugin`**
- **[`vite-plugin-vercel@beta`](https://github.com/magne4000/vite-plugin-vercel/pull/207)**

## Usage
### Framework authors

[Call `store.entries.push`](https://github.com/photon-js/universal-deploy/blob/83ed1ffea2d0d552f6883f12677cf0091ac027d7/tests/awesome-framework/src/vite/universalDeployPlugin.ts#L18) at any point, preferably before `configResolved` hooks.

### Deployment plugin authors

[Read `store.entries`](https://github.com/magne4000/vite-plugin-vercel/blob/a7fe4da0bbb68a4eca4f064d6296f703db7e0d3d/packages/vite-plugin-vercel/src/plugins/loader.ts#L92-L102) in a `post` `configEnvironment` hook and set `rollupOptions.input`.

> [!NOTE]
> [`this.emitFile`](https://rollupjs.org/plugin-development/#this-emitfile) can also be used at later stages to achieve the same result.

## Examples

- [`examples/tanstack-start`](./examples/tanstack-start): TanStack Start app deployed to Netlify, Cloudflare, Vercel, or Node.js/Bun/Deno.
- Minimal examples:
  - [`examples/app-node`](./examples/app-node)
  - [`examples/app-vercel`](./examples/app-vercel)
  - [`examples/app-netlify`](./examples/app-netlify)
  - [`examples/app-cloudflare`](./examples/app-cloudflare)


## License

MIT
