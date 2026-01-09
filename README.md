# universal-deploy

Deploy your Vite applications everywhere with a unified set of adapters.

## Features

- **Unified Adapters**: One way to target multiple deployment platforms.
- **Vite Integration**: Seamlessly works as Vite plugins.
- **Support for Major Platforms**: Node.js, Vercel, Netlify, Cloudflare, and more.

## Installation

```bash
pnpm add -D @universal-deploy/node # or any other adapter
```

## Usage

Add the adapter to your `vite.config.ts`:

```typescript
import { node } from "@universal-deploy/node/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    node(),
    // ... other plugins
  ],
});
```

## Supported Adapters

- `@universal-deploy/node`: For Node.js, Bun, and Deno environments.
- `@universal-deploy/vercel`: Built-in support for Vercel.
- `@universal-deploy/netlify`: Built-in support for Netlify.
- `@universal-deploy/cloudflare`: Support for Cloudflare Pages/Workers.

## Examples

Check out the `examples/` directory for implementation details with various frameworks:

- `tanstack-start`: TanStack Start with Vercel and Node.js.
- `app-node`: Minimal Node.js setup.
- `app-vercel`: Minimal Vercel setup.

## License

MIT
