## @universal-deploy/auto

Automatically enables the Node.js adapter if no other deployment target (Vercel, Cloudflare, Netlify) is detected in the Vite configuration.

### Installation

```bash
pnpm add -D @universal-deploy/auto
```

### Usage

Add the `auto` plugin to your `vite.config.ts`:

```ts
import { auto } from "@universal-deploy/auto/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    auto(),
    // ... other plugins
  ],
});
```

### How it works

The `auto()` plugin detects the presence of other deployment adapters in your Vite configuration. If any of the following plugins are found, it automatically disables its own Node.js adapter injection:

- `vite-plugin-vercel`
- `@cloudflare/vite-plugin`
- `@netlify/vite-plugin` (also requires `@universal-deploy/netlify` for compatibility)

If none of these are present, it enables `@universal-deploy/node` to provide a default Node.js-compatible server build.

### Options

The `auto()` plugin accepts the following options:

- `node`: Same options as the `@universal-deploy/node` adapter:
    - `static`: (string | boolean) The directory containing static assets. Defaults to the client output directory.
    - `importer`: (string) The importer to use when resolving the server entry.
