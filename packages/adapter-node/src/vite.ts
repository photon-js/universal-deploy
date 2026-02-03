import { builtinModules } from "node:module";
import { defaultClientConditions, defaultExternalConditions, defaultServerConditions, type Plugin } from "vite";

// @ts-expect-error Bun global
const isBun = typeof Bun !== "undefined";
// @ts-expect-error Deno global
const isDeno = typeof Deno !== "undefined";
const re_photonNode = /^virtual:photon:node-entry$/;

// Creates a server and listens for connections in Node/Deno/Bun
export function node(): Plugin[] {
  return [
    // Resolves virtual:photon:node-entry to its node runtime id
    {
      name: "photon:node:node-entry",
      apply: "build",

      resolveId: {
        filter: {
          id: re_photonNode,
        },
        async handler(id, importer) {
          const resolved = await this.resolve("@universal-deploy/node/serve", importer);
          if (!resolved) {
            throw new Error(`Cannot find server entry ${JSON.stringify(id)}`);
          }

          return {
            id: resolved.id,
          };
        },
      },
    },
    // Bun and Deno conditions
    {
      name: "photon:node:node-like",
      configEnvironment(_name, config) {
        const defaultCondition = config.consumer === "client" ? defaultClientConditions : defaultServerConditions;
        const additionalCondition = isBun ? ["bun"] : isDeno ? ["deno"] : [];

        return {
          resolve: {
            conditions: [...additionalCondition, ...defaultCondition],
            externalConditions: [...additionalCondition, ...defaultExternalConditions],
          },
        };
      },
    },
    // Emit the node entry
    {
      name: "photon:node:emit",
      apply: "build",
      config: {
        order: "post",
        handler() {
          return {
            environments: {
              ssr: {
                build: {
                  rollupOptions: {
                    input: {
                      index: "virtual:photon:node-entry",
                    },
                  },
                },
              },
            },
            resolve: {
              // Ensure that all native node modules start with `node:`, mostly for Deno compat
              alias: Object.fromEntries(
                builtinModules.filter((m) => !m.startsWith("node:")).map((m) => [m, `node:${m}`]),
              ),
            },
          };
        },
      },
    },
  ];
}
