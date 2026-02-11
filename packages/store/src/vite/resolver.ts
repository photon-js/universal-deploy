import type { Environment, Plugin } from "vite";
import { type EntryMeta, getAllEntries } from "../index.js";

export interface ResolverApi {
  /**
   * Map a resolved ID to zero, one, or multiple entries
   */
  findEntries: Map<string, EntryMeta[]>;
}

interface InternalResolverApi {
  addEntry(resolvedId: string, ...meta: EntryMeta[]): void;
}

const pluginName = "ud:resolver";

/**
 * Keep track of resolved server entries
 */
export function resolver(): Plugin<(env: Environment) => ResolverApi> {
  const stateId = new WeakMap<Environment, Set<string>>();
  const apiState = new WeakMap<Environment, Map<string, EntryMeta[]>>();

  function getApi(env: Environment): ResolverApi & InternalResolverApi {
    if (!apiState.has(env)) {
      apiState.set(env, new Map());
    }

    // biome-ignore lint/style/noNonNullAssertion: ok
    const entriesMap = apiState.get(env)!;

    return {
      findEntries: entriesMap,
      addEntry(resolvedId, ...meta: EntryMeta[]) {
        const entries = entriesMap.get(resolvedId) ?? [];
        entries.push(...meta);
        entriesMap.set(resolvedId, entries);
      },
    };
  }

  return {
    name: pluginName,
    enforce: "pre",
    perEnvironmentStartEndDuringDev: true,
    sharedDuringBuild: false,

    buildStart() {
      const entriesId = new Set<string>();
      for (const e of getAllEntries()) {
        entriesId.add(e.id);
      }
      stateId.set(this.environment, entriesId);
    },

    api(env) {
      // public API
      const { findEntries } = getApi(env);

      return {
        findEntries,
      };
    },

    resolveId: {
      order: "pre",
      async handler(id: string, importer: string | undefined, options) {
        if (stateId.get(this.environment)?.has(id)) {
          const resolved = await this.resolve(id, importer, {
            skipSelf: true,
            ...options,
          });

          if (resolved) {
            getApi(this.environment).addEntry(resolved.id, ...getAllEntries().filter((e) => e.id === id));
          }

          return resolved;
        }
      },
    },
  };
}

const resolverPluginWm = new WeakMap<Environment, ReturnType<typeof resolver>>();
export function isServerEntry(env: Environment, id: string): boolean {
  let resolverPlugin: ReturnType<typeof resolver> | undefined = resolverPluginWm.get(env);
  if (!resolverPlugin) {
    resolverPlugin = env.plugins.find((p) => p.name === pluginName);
    if (resolverPlugin) {
      resolverPluginWm.set(env, resolverPlugin);
    }
  }
  if (!resolverPlugin || !resolverPlugin.api) throw new Error(`Missing ${pluginName} plugin`);

  return (resolverPlugin.api(env).findEntries.get(id)?.length ?? 0) > 0;
}
