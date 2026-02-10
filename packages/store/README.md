## @universal-deploy/store

This package provides a global `store` object for registering server entries.
```js
import { store } from "@universal-deploy/store";

// Registering — add entries to the store
store.entries.push(
  {
    id: "./src/server/api.ts",
    pattern: "/api",
  },
);
```

### Entry Configuration

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
   * Route pattern(s) for this entry.
   *
   * Should be a valid {@link https://github.com/h3js/rou3 | rou3} pattern.
   */
  route: string | string[];
  /**
   * The Vite environment for this entry.
   *
   * @default ssr
   */
  environment?: string;
}
```

### Vite Plugins

#### `catchAll`

Creates a `virtual:ud:catch-all` entry that aggregates all store entries and handles routing between them.

#### `devServer`

Adds development middleware that invokes the catch-all entry, applies `transformIndexHtml` transformations when needed, and returns the response to the client.

#### `compat`

Provides compatibility for resolving SSR Rollup entries and automatically registers them in the global store.
