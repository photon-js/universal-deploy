Minimal Vite app using [`awesome-framework`](/tests/awesome-framework) deployed to Netlify.

### How it works

[`awesome-framework`](/tests/awesome-framework) declares the following routes:
- `/standalone`, `/api`: Plain-text server responses
- `/**`: SSR response. Will send `src/entry-client.ts` as client-side code.

`awesome-framework` uses `@universal-deploy/store` to [declare its server entries](/tests/awesome-framework/src/vite/universalDeployPlugin.ts).

Deployment to **Netlify** is done through [`@universal-deploy/netlify`](./packages/adapter-netlify) (see [vite.config.ts](./vite.config.ts)).
