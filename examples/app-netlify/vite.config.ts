import { netlify } from "@universal-deploy/netlify/vite";
import { awesomeFramework } from "awesome-framework/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    // re-exports @netlify/vite-plugin, and sets rollupOptions.input to virtual:ud:catch-all
    netlify(),
    // Minimal SSR framework. Includes devServer and catchAll plugins from @universal-deploy/store
    awesomeFramework({
      additionalEntries: [
        {
          id: "./src/api/test.ts",
          pattern: "/api/test",
        },
      ],
    }),
  ],
});
