Minimal SSR app based on [`awesome-framework`](/tests/awesome-framework) deployed with Node.js/Bun/Deno.

### How it works

[`awesome-framework`](/tests/awesome-framework) declares the following routes:
- `/standalone`, `/api`: Plain-text server responses
- `/**`: SSR response. Will send `src/entry-client.ts` as client-side code.

`awesome-framework` uses `@universal-deploy/store` to [declare its server entries](/tests/awesome-framework/src/vite/universalDeployPlugin.ts).

Deployment for **Node/Bun/Deno** is done through [vite.config.ts](./vite.config.ts).
