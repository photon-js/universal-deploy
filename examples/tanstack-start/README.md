This demo shows a TanStack Start app extended with universal server entry support via `@universal-deploy/store`.

### Features

- **[compat](./vite.common.config.ts)**: Extracts the server entry from `rollupOptions.input` and registers it in the global store
- **[catchAll](./vite.common.config.ts)**: Required by the `compat` plugin (see [store/README.md](/packages/store/README.md#catchall) for details)

### Deployment Options

The app can be deployed to multiple platforms:

- **Netlify**: [vite.netlify.config.ts](./vite.netlify.config.ts)
- **Cloudflare**: [vite.cloudflare.config.ts](./vite.cloudflare.config.ts) + [wrangler.jsonc](./wrangler.jsonc)
- **Vercel**: [vite.vercel.config.ts](./vite.vercel.config.ts)
- **Node.js/Bun/Deno**: [vite.config.ts](./vite.config.ts)