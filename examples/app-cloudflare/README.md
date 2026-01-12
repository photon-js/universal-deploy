Minimal Vite app using [`awesome-framework`](/tests/awesome-framework) deployed on Cloudflare Workers.

### How it works

[`awesome-framework`](/tests/awesome-framework) declares the following routes:
- `/api`: Plain-text server response
- `/**`: SSR response. Will send `src/entry-client.ts` as client-side code.

`awesome-framework` uses `@universal-deploy/store` to [declare its server entries](/tests/awesome-framework/src/vite/universalDeployPlugin.ts).

Deployment to **Cloudflare** is done through `@cloudflare/vite-plugin` (see [vite.config.ts](./vite.config.ts) and [wrangler.jsonc](./wrangler.jsonc)).
