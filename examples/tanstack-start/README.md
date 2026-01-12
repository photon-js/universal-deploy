Demo of a tanstack-start app with added support for universal server entries through `@universal-deploy/store`.

- [compat](./vite.common.config.ts): extracts fetchable server entry from `rollupOptions.input`, and puts it into the global store
- [catchAll](./vite.common.config.ts): requirement for `compat` plugin. See [store/README.md](/packages/store/README.md#catchall)
- Cloudflare deployment through [vite.cloudflare.config.ts](./vite.cloudflare.config.ts) + [wrangler.jsonc](./wrangler.jsonc)
- Vercel deployment through [vite.vercel.config.ts](./vite.vercel.config.ts)
- Node deployment through [vite.config.ts](./vite.config.ts)