import { awesomeFramework } from "awesome-framework/vite";
import { defineConfig } from "vite";
import { vercel } from "vite-plugin-vercel/vite";

export default defineConfig({
  plugins: [
    // TODO: this sentence isn't clear (I managed to understand with brain power because we discussed it)
    // Version of vite-plugin-vercel that reads entries from @universal-deploy/store
    vercel(),
    // Minimal SSR framework. Includes devServer and catchAll plugins from @universal-deploy/store
    awesomeFramework(),
  ],
});
