import type { Plugin } from "vite";
import { dependsOn, isServerEntry } from "../utils.js";

export function hmr(): Plugin {
  return {
    name: "photon:hmr",
    apply: "serve",

    transform(code: string, id: string) {
      if (!isServerEntry(this, id)) return;

      const transformed = `${code}

if (import.meta.hot) {
  import.meta.hot.accept();
}
`;

      return {
        code: transformed,
        map: null,
      };
    },

    ...dependsOn("photon:resolve-entries"),
  };
}
