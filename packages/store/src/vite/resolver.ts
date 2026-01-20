import type { Plugin } from "vite";
import { store } from "../index.js";

/**
 * Keep track of resolved server entries
 */
export function resolveTracker(): Plugin {
  return {
    name: "photon:resolve-entries",
    enforce: "pre",

    resolveId: {
      order: "pre",
      async handler(id: string, importer: string | undefined, options) {
        if (
          Object.values(store.entries)
            .map((e) => e.id)
            .includes(id)
        ) {
          const resolved = await this.resolve(id, importer, {
            skipSelf: true,
            ...options,
          });

          if (resolved) {
            if (!resolved.external) {
              return {
                ...resolved,
                meta: {
                  ...resolved.meta,
                  // FIXME find a better name
                  entries: [...resolved.meta.entries, id],
                },
              };
            }
            return resolved;
          }
        }
      },
    },

    sharedDuringBuild: true,
  };
}
