import createNetlifyPlugin, { type NetlifyPluginOptions } from "@netlify/vite-plugin";
import { catchAllEntry } from "@universal-deploy/store";
import type { Plugin } from "vite";

const moduleId = "ud:netlify";

export function netlify(config?: NetlifyPluginOptions): Plugin[] {
  return [
    {
      name: `${moduleId}:apply-store`,
      apply: "build",
      enforce: "post",
      configEnvironment: {
        // Give some time to other plugins to declare an entry in the store
        order: "post",
        handler(name, env) {
          if (env.consumer !== "server" && name !== "ssr") return;
          const optionName = this.meta.rolldownVersion ? "rolldownOptions" : "rollupOptions";

          return {
            build: {
              [optionName]: {
                input: {
                  index: catchAllEntry,
                },
              },
            },
          };
        },
      },
    },
    // Currently (@netlify/vite-plugin@2.7.17), the netlify build plugin reads bundle artifacts and looks for a unique `isEntry` chunk
    ...createNetlifyPlugin({
      ...config,
      build: {
        enabled: true,
        ...config?.build,
      },
    }),
  ];
}
