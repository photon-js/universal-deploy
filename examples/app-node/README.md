Minimal Vite app using [`awesome-framework`](/tests/awesome-framework) deployed with Node.js/Bun/Deno.

### How it works

[`awesome-framework`](/tests/awesome-framework) declares the following routes:
- `/api`: Plain-text server response
- `/**`: SSR response. Will send `src/entry-client.ts` as client-side code.

`awesome-framework` uses `@universal-deploy/store` to [declare its server entries](/tests/awesome-framework/src/vite/universalDeployPlugin.ts).

Deployment with **Node/Bun/Deno** is done through [`@universal-deploy/node`](./packages/adapter-node) (see [vite.config.ts](./vite.config.ts)).
