TanStack Start app deployed anywhere.

### Universal Deployment

The app can be deployed to:

- **Netlify**: [vite.netlify.config.ts](./vite.netlify.config.ts)
- **Cloudflare**: [vite.cloudflare.config.ts](./vite.cloudflare.config.ts) + [wrangler.jsonc](./wrangler.jsonc)
- **Vercel**: [vite.vercel.config.ts](./vite.vercel.config.ts)
- **Node.js/Bun/Deno**: [vite.config.ts](./vite.config.ts)

### How it works

TODO: explain that is the the minimal interface between TanStack Start and UD. This is temporary until TanStack adopts UD.

- **[compat](./vite.common.config.ts)**: Extracts the server entry from `rollupOptions.input` and registers it in the global store
- **[catchAll](./vite.common.config.ts)**: Required by the `compat` plugin (see [store/README.md](/packages/store/README.md#catchall) for details)

That's it. It's the only changes required to make a TanStack app compatible with Universal Deploy.
