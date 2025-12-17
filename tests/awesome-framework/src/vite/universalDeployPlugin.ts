import { store } from "@universal-deploy/store";
import { catchAll, devServer } from "@universal-deploy/store/vite";
import type { Plugin } from "vite";

// The vite config file can be loaded multiple times (once per env + 1),
// meaning that the `config` hook of all plugins can run multiple times.
let injected = false;
export function universalDeployPlugin(): Plugin[] {
  return [
    {
      name: "awesome-framework:universal-deploy",
      config() {
        if (injected) return;
        injected = true;
        store.entries.push(
          {
            id: "awesome-framework/standalone",
            pattern: "/standalone",
          },
          {
            id: "awesome-framework/api",
            pattern: "/api",
          },
          {
            id: "awesome-framework/ssr",
            pattern: "/:slug*",
          },
        );
      },
    },
    // Forwards request to server entries from a vite dev server middleware
    devServer(),
    // Required for other plugins to work
    catchAll(),
  ];
}
