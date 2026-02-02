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
      config: {
        order: "pre",
        handler() {
          if (injected) return;
          injected = true;
          // Declaring server entries through @universal-deploy/store
          store.entries.push(
            {
              id: "awesome-framework/api",
              pattern: "/api",
            },
            {
              id: "awesome-framework/ssr",
              // FIXME rou3 pattern for POC, should later be updated to URLPatternInit
              pattern: "/**",
            },
          );
        },
      },
    },
    // Forwards request to server entries from a vite dev server middleware
    devServer(),
    // Required by devServer
    catchAll(),
  ];
}
