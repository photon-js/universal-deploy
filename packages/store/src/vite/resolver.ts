import { type Plugin, perEnvironmentState } from "vite";
import { store } from "../index.js";

/**
 * Keep track of resolved server entries
 */
export function resolveTracker(): Plugin {
  const entries = perEnvironmentState<Set<string>>(() => new Set());
  return {
    name: "photon:resolve-entries",
    enforce: "pre",

    buildStart() {
      for (const e of Object.values(store.entries)) {
        entries(this).add(e.id);
      }
    },

    resolveId: {
      order: "pre",
      async handler(id: string, importer: string | undefined, options) {
        if (entries(this).has(id)) {
          const resolved = await this.resolve(id, importer, {
            skipSelf: true,
            ...options,
          });

          if (resolved) {
            return {
              ...resolved,
              meta: {
                ...resolved.meta,
                // FIXME find a better name
                entries: [...(resolved.meta?.entries ?? []), id],
              },
            };
          }
        }
      },
    },

    perEnvironmentStartEndDuringDev: true,
    sharedDuringBuild: true,
  };
}
