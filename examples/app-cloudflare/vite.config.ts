import { cloudflare } from "@cloudflare/vite-plugin";
import { awesomeFramework } from "awesome-framework/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    cloudflare({
      inspectorPort: false,
      viteEnvironment: {
        name: "ssr",
      },
    }),
    awesomeFramework(),
  ],
});
