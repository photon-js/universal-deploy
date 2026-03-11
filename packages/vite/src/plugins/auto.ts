import { node } from "@universal-deploy/node/vite";
import type { ConfigEnv, ConfigPluginContext, Plugin, UserConfig } from "vite";
import { catchAll, devServer } from "../index.js";

type NodePluginOptions = Parameters<typeof node>[0];

const INSTANCE = Symbol("auto-instance");

/**
 * Automatically enables the node adapter if no other deployment target (Vercel, Cloudflare, Netlify) is detected.
 */
export function auto(options?: { node?: NodePluginOptions }): Plugin[] {
  const instance = Symbol("instance");
  return [
    catchAll(),
    devServer(),
    // Enable node adapter only if no other deployment target has been found
    ...node(options?.node).map((p) => {
      // @ts-expect-error
      p[INSTANCE] = instance;
      // Disable node() plugin later when Vite's config() hook runs, because noDeploymentTargetFound() requires `config`
      return enablePluginIf((config) => noDeploymentTargetFound(p, config), p);
    }),
  ];
}

/**
 * Enables a plugin based on a specified condition callback which will be executed in the `config` hook.
 */
function enablePluginIf(condition: EnableCondition, originalPlugin: Plugin): Plugin {
  const originalConfig = originalPlugin.config;

  originalPlugin.config = {
    order: originalConfig && "order" in originalConfig ? originalConfig.order : "pre",
    async handler(c, e) {
      const enabled = await condition.call(this, c, e);
      if (!enabled) {
        const keysToDelete = Object.keys(originalPlugin).filter((k) => k !== "name");
        originalPlugin.name += ":disabled";
        for (const key of keysToDelete) {
          // @ts-expect-error
          delete originalPlugin[key];
        }
      } else if (originalConfig) {
        if (typeof originalConfig === "function") {
          return originalConfig.call(this, c, e);
        }
        return originalConfig.handler.call(this, c, e);
      }
    },
  };

  return originalPlugin;
}
type EnableCondition = (this: ConfigPluginContext, config: UserConfig, env: ConfigEnv) => boolean | Promise<boolean>;

async function noDeploymentTargetFound(thisNodePlugin: Plugin, c: UserConfig) {
  const plugins = (await asyncFlatten((c.plugins ?? []) as Plugin[])).filter((p): p is Plugin => Boolean(p));

  // vite-plugin-vercel
  const vitePluginVercel = plugins.some((p) => p.name.match(/^vite-plugin-vercel/));
  // @cloudflare/vite-plugin
  const cloudflareVitePlugin = plugins.some((p) => p.name.match(/^vite-plugin-cloudflare/));
  // @netlify/vite-plugin (via @universal-deploy/netlify)
  const netlifyVitePlugin = plugins.some((p) => p.name.match(/^ud:netlify/));

  // Check for other instances of ud:node:emit that are NOT this one
  const otherNodePlugin = plugins.some(
    (p) =>
      p.name.startsWith("ud:node:emit") &&
      // @ts-expect-error
      p[INSTANCE] !== thisNodePlugin?.[INSTANCE],
  );

  return !vitePluginVercel && !cloudflareVitePlugin && !netlifyVitePlugin && !otherNodePlugin;
}

async function asyncFlatten<T>(arr: T[]): Promise<T[]> {
  const flattened: T[] = [];
  for (const item of arr) {
    if (Array.isArray(item)) {
      flattened.push(...(await asyncFlatten(item)));
    } else if (item instanceof Promise) {
      flattened.push(...(await asyncFlatten([await item])));
    } else if (item) {
      flattened.push(item);
    }
  }
  return flattened;
}
