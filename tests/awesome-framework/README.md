# Framework powered by Vite and universal-deploy

A demo framework showcasing how to integrate the global store into a Vite-based framework.

It declares the following routes:
- `/api`: Plain-text server response
- `/**`: SSR response. Will send `src/entry-client.ts` as client-side code.

It uses `@universal-deploy/store` to [declare its server entries](./src/vite/universalDeployPlugin.ts).
