/// <reference types="@photonjs/runtime" />
import { cloudflare } from "@photonjs/cloudflare/vite";
import { awesomeFramework } from "awesome-framework/vite";
import { defineConfig } from "vite";

export default defineConfig({
  photon: {
    server: "server.ts",
    entries: {
      // foo entry declares its route with `enhance` directly inside the file
      foo: "src/middlewares/foo.ts",
      // bar entry route is declared here, and `enhance` is not used
      bar: {
        id: "src/middlewares/bar.ts",
        route: "/bar",
      },
    },
  },
  plugins: [
    cloudflare({
      inspectorPort: false,
    }),
    awesomeFramework(),
  ],
});
