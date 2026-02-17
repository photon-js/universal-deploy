import { node } from "@universal-deploy/node/vite";
import { hmr, resolver } from "@universal-deploy/store/vite";
import { awesomeFramework } from "awesome-framework/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    // Emits dist/index.js
    node(),
    // Minimal SSR framework. Includes devServer and catchAll plugins from @universal-deploy/store
    awesomeFramework({
      additionalEntries: [
        {
          id: "./src/api/test.ts",
          route: "/api/test",
        },
      ],
    }),
    resolver(),
    hmr(),
  ],
});
