import { awesomeFramework } from "awesome-framework/vite";
import { defineConfig } from "vite";
import { vercel } from "vite-plugin-vercel/vite";

export default defineConfig({
  plugins: [
    // Can be replaced by @universal-deploy/node/vite to target node/bun/deno instead
    vercel(),
    awesomeFramework(),
  ],
});
