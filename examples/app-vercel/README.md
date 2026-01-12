Minimal Vite app using [`awesome-framework`](/tests/awesome-framework) deployed to Vercel.

### How it works

[`awesome-framework`](/tests/awesome-framework) declares the following routes:
- `/api`: Plain-text server response
- `/**`: SSR response. Will send `src/entry-client.ts` as client-side code.

`awesome-framework` uses `@universal-deploy/store` to [declare its server entries](/tests/awesome-framework/src/vite/universalDeployPlugin.ts).

Deployment for **Vercel** is done through [`vite-plugin-vercel@beta`](https://github.com/magne4000/vite-plugin-vercel/pull/207) (see [vite.config.ts](./vite.config.ts)).
