import type { Plugin, ViteDevServer } from "vite";
import { renderUrl } from "../renderUrl.js";

const virtualIndex = "virtual:awesome-plugin:index.html";
const virtualIndexSsr = "virtual:awesome-plugin:index-js";

let clientHtml = "";
export function awesomeFrameworkPlugin(): Plugin[] {
  let server: ViteDevServer | undefined;
  return [
    {
      name: "awesome-framework",
      config() {
        return {
          ssr: {
            noExternal: ["awesome-framework"],
          },
          builder: {
            async buildApp(builder) {
              // biome-ignore lint/style/noNonNullAssertion: exists
              await builder.build(builder.environments.client!);

              if (builder.environments.ssr?.config.build.rollupOptions.input) {
                // biome-ignore lint/style/noNonNullAssertion: exists
                await builder.build(builder.environments.ssr!);
              }
            },
          },
        };
      },
      configEnvironment(name) {
        if (name === "ssr") {
          return {
            optimizeDeps: {
              // awesome-framework is an ESM package, so no need to optimize it
              exclude: ["awesome-framework"],
            },
            build: {
              outDir: "./dist/server",
              emptyOutDir: false,
            },
          };
        }
        if (name === "client") {
          const optionName = this.meta.rolldownVersion ? "rolldownOptions" : "rollupOptions";
          return {
            build: {
              [optionName]: {
                input: {
                  index: virtualIndex,
                },
              },
              outDir: "./dist/client",
            },
          };
        }
      },
      resolveId(id) {
        if (id === virtualIndex) {
          return "index.html";
        }
        if (id === virtualIndexSsr) {
          return virtualIndexSsr;
        }
      },
      transformIndexHtml: {
        handler(html) {
          clientHtml = html;
          return html;
        },
      },
      configureServer: {
        order: "pre",
        handler(devServer) {
          server = devServer;
        },
      },
      async load(id) {
        if (id === "index.html") {
          return renderUrl("/");
        }
        if (id === virtualIndexSsr) {
          if (this.environment.config.command === "serve" && server) {
            await server.transformIndexHtml("/", renderUrl("/"));
          }
          return `export default ${JSON.stringify(clientHtml)};`;
        }
      },
      sharedDuringBuild: true,
    },
    {
      name: "awesome-framework:client-entry",
      enforce: "pre",
      resolveId: {
        filter: {
          id: /^virtual:awesome-framework:client-entry$/,
        },
        handler() {
          return this.resolve("src/entry-client.ts");
        },
      },
    },
  ];
}
