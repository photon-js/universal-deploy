import { netlify } from "@universal-deploy/netlify/vite";
import { awesomeFramework } from "awesome-framework/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    // Can be replaced by @universal-deploy/node/vite to target node/bun/deno instead
    netlify(),
    awesomeFramework(),
  ],
});
