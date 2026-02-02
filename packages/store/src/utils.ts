import type { Environment, Plugin } from "vite";
import { catchAllId } from "./const.js";
import type { resolver } from "./vite/resolver.js";

export const pluginsUsage = {
  [catchAllId]: "@universal-deploy/store/vite",
  "photon:resolve-entries": "@universal-deploy/store/vite",
} as const;

export function dependsOn(pluginName: keyof typeof pluginsUsage) {
  return {
    configResolved(config) {
      if (!config.plugins.some(({ name }) => name === pluginName)) {
        this.error(`"${pluginName}" Vite plugin is missing. Install it from "${pluginsUsage[pluginName]}".`);
      }
    },
  } satisfies Partial<Plugin>;
}

export function assertFetchable(mod: unknown, id: string): Fetchable {
  if (!mod || typeof mod !== "object") throw new Error(`Missing default export from ${id}`);
  if ("default" in mod && mod.default) mod = mod.default;
  if (!mod || typeof mod !== "object" || !("fetch" in mod) || typeof mod.fetch !== "function")
    throw new Error(`Default export from ${id} must include a { fetch() } function`);
  return mod as Fetchable;
}

const resolverPluginWm = new WeakMap<Environment, ReturnType<typeof resolver>>();
export function isServerEntry(env: Environment, id: string): boolean {
  let resolverPlugin: ReturnType<typeof resolver> | undefined = resolverPluginWm.get(env);
  if (!resolverPlugin) {
    resolverPlugin = env.plugins.find((p) => p.name === "photon:resolver");
    if (resolverPlugin) {
      resolverPluginWm.set(env, resolverPlugin);
    }
  }
  if (!resolverPlugin || !resolverPlugin.api) throw new Error("Missing photon:resolver plugin");

  return (resolverPlugin.api(env).findEntries.get(id)?.length ?? 0) > 0;
}

// Types

export interface Fetchable {
  fetch: (request: Request) => Response | Promise<Response>;
}
