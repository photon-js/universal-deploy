TanStack Start app deployed anywhere.

### Universal Deployment

The app can be deployed to:

- **Netlify**: [vite.netlify.config.ts](./vite.netlify.config.ts)
- **Cloudflare**: [vite.cloudflare.config.ts](./vite.cloudflare.config.ts) + [wrangler.jsonc](./wrangler.jsonc)
- **Vercel**: [vite.vercel.config.ts](./vite.vercel.config.ts)
- **Node.js/Bun/Deno**: [vite.config.ts](./vite.config.ts)

### How it works

Here 2 plugins are added to bridge the gap between TanStack Start and universal-deploy. Those will not be required when TanStack Start adopts universal-deploy:

- **[compat](./vite.common.config.ts)**: Extracts the server entry from `rollupOptions.input` and registers it in the global store
- **[catchAll](./vite.common.config.ts)**: Required by the `compat` plugin (see [store/README.md](/packages/store/README.md#catchall) for details)

That's it. It's the only changes required to make TanStack Start compatible with Universal Deploy.
