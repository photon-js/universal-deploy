# universal-deploy

Deploy your Vite applications everywhere with a unified set of adapters.

## Overview

`universal-deploy` is a framework-agnostic solution for deploying Vite applications across multiple platforms using a consistent adapter API. It provides a global store for managing server entries and routing, along with platform-specific adapters that handle the deployment specifics.

## Features

- **Unified Adapters**: One way to target multiple deployment platforms.
- **Vite Integration**: Seamlessly works as Vite plugins.
- **Support for Major Platforms**: Node.js, Vercel, Netlify, Cloudflare, and more.
- **Framework Agnostic**: Works with any Vite-based framework.
- **Universal Routing**: Built-in routing with URLPattern API support.
- **Development Middleware**: Integrated dev server support with HTML transformations.

## Core Concepts

### The Store (`@universal-deploy/store`)

The store is the heart of `universal-deploy`. It provides a global registry for managing server entries with routing capabilities.

```js
import { store } from "@universal-deploy/store";

// Add entries to the store
store.entries.push(
  {
    id: "awesome-framework/standalone",
    pattern: "/standalone",
  },
  {
    id: "./src/server/api.ts",
    pattern: "/api",
  },
);
```

#### Entry Configuration

Each entry accepts the following options:

```ts
export interface EntryMeta {
  /**
   * Module identifier for this entry. This can be a filesystem path or a virtual module.
   */
  id: string;
  /**
   * HTTP method(s) to match. When omitted, matches all HTTP methods.
   */
  method?: HttpMethod | HttpMethod[];
  /**
   * Route pattern(s) to match for this entry.
   *
   * Uses the URLPattern API syntax.
   */
  pattern: URLPatternInput | URLPatternInput[];
  /**
   * The Vite environment for this entry.
   *
   * @default ssr
   */
  environment?: string;
}
```

#### Included Plugins

- **`catchAll`**: Creates a `virtual:ud:catch-all` entry that aggregates all store entries and handles routing between them.
- **`devServer`**: Adds development middleware that invokes the catch-all entry, applies `transformIndexHtml` transformations when needed, and returns the response to the client.
- **`compat`**: Provides compatibility for resolving SSR Rollup entries and automatically registers them in the global store.

## Installation

```bash
# Install a specific adapter
pnpm add -D @universal-deploy/node
# or
pnpm add -D @universal-deploy/netlify

# The store is included as a dependency
```

## Supported Adapters

### `@universal-deploy/node`

Wraps `@universal-deploy/store` entries with [srvx](https://srvx.h3.dev/) and [sirv](https://universal-middleware.dev/middlewares/sirv) for serving applications on Node.js, Bun, and Deno.

**Installation:**
```bash
pnpm add -D @universal-deploy/node
```

**Usage:**
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

### `@universal-deploy/netlify`

Re-exports `@netlify/vite-plugin` with `build.enabled: true`, and sets `rollupOptions.input` to `virtual:ud:catch-all`.

**Installation:**
```bash
pnpm add -D @universal-deploy/netlify
```

**Usage:**
```typescript
import { netlify } from "@universal-deploy/netlify/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    netlify(),
    // ... other plugins
  ],
});
```

### `@universal-deploy/vercel`

Built-in support for Vercel deployments using the Vercel build output API.

**Installation:**
```bash
pnpm add -D @universal-deploy/vercel
```

### `@universal-deploy/cloudflare`

Support for Cloudflare Pages and Workers deployments.

**Installation:**
```bash
pnpm add -D @universal-deploy/cloudflare
```

## Examples

The repository includes several examples demonstrating different deployment scenarios:

### Minimal Examples

- **`app-node`**: Minimal Node.js setup
- **`app-vercel`**: Minimal Vercel setup
- **`app-netlify`**: Minimal Netlify setup
- **`app-cloudflare`**: Minimal Cloudflare setup

### Framework Examples

#### `tanstack-start`

A comprehensive example showing TanStack Start with multi-platform deployment support.

**Features:**
- **compat**: Extracts the server entry from `rollupOptions.input` and registers it in the global store
- **catchAll**: Required by the `compat` plugin for routing aggregation

**Deployment Options:**
- **Netlify**: `vite.netlify.config.ts`
- **Cloudflare**: `vite.cloudflare.config.ts` + `wrangler.jsonc`
- **Vercel**: `vite.vercel.config.ts`
- **Node.js/Bun/Deno**: `vite.config.ts`

## Usage

### Basic Setup

1. Install an adapter for your target platform
2. Add the adapter to your `vite.config.ts`
3. Configure your server entries in the store (if needed)

```typescript
import { node } from "@universal-deploy/node/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    node(),
    // ... your other plugins
  ],
});
```

### Multi-Platform Setup

You can create multiple Vite config files for different platforms:

```
vite.config.ts           # Node.js
vite.vercel.config.ts    # Vercel
vite.netlify.config.ts   # Netlify
vite.cloudflare.config.ts # Cloudflare
```

## Development

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm run build

# Run tests
pnpm run test

# Format code
pnpm run format
```

## Repository Structure

```
├── packages/
│   ├── store/              # Core store implementation
│   ├── adapter-node/       # Node.js adapter
│   └── adapter-netlify/    # Netlify adapter
├── examples/
│   ├── tanstack-start/     # TanStack Start example
│   ├── app-node/           # Minimal Node.js example
│   ├── app-vercel/         # Minimal Vercel example
│   ├── app-netlify/        # Minimal Netlify example
│   └── app-cloudflare/     # Minimal Cloudflare example
└── tests/
    └── awesome-framework/  # Framework integration demo
```

## Contributing

This is a monorepo managed with pnpm workspaces. Contributions are welcome!

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run `pnpm run format` to format your code
5. Submit a pull request

## License

MIT
