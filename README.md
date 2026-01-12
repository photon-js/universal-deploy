TODO:
- add readme to each examples/* expaining what it's showing exactly (at first I was looking for a server entry but I finally realized that the server is implemented by `awesomeFramework`. So I guess explain that the mininal examples show how AwesomeFramework is deployed.
- Show how AwesomeFramework integrates with UD?
- I don't see where https://github.com/photon-js/universal-deploy/tree/main/examples/app-vercel/src/middlewares are being imported? I guess a readme is really needed here.

# universal-deploy

**Deploy your Vite app anywhere.**

## Goal

As discussed at [Netlify's RFC](https://github.com/vitejs/vite/discussions/20907), this project aims to... TODO: explain vision: what is the goal here? From the perspective of a user, framework, and deployment provider. Just a little paragraph.

TODO: say (or even better explain) that it's minimal

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

Comments:
- I don't understand `devServer` — it doesn't feel minimal.
- Not sure I understand why `catchAll` and `compat` are plugins. A plugin system sounds complicated, not minimal.
- Maybe the trick is to mention that all the "plugin system" are temporary (we aren't sure where code will end up living at)
- Or, at least, maybe we don't use the word "plugin" but "modules" instead.
- Or, we just remove this section...

- **[`catchAll`](./packages/store/src/vite/catch-all.ts)**: Aggregates server entries into a single `virtual:ud:catch-all` module
- **[`devServer`](./packages/store/src/vite/dev-server.ts)**: Handles routing and HTML transforms during development
- **[`compat`](./packages/store/src/vite/rollup-entries-compat.ts)**: Auto-registers SSR rollup entries in the store (for Vite-based frameworks that didn't adopt `universal-deploy` yet)

### Adapters

TODO:
- Explain the goal of the `@universal-deploy` packages. They are temporary, very important.
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
