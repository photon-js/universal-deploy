import MagicString from "magic-string";
import type { Plugin } from "vite";
import { isServerEntry } from "./resolver.js";

export function hmr(): Plugin {
  return {
    name: "ud:hmr",
    apply: "serve",
    applyToEnvironment(env) {
      return env.config.consumer === "server";
    },

    async transform(code: string, id: string) {
      if (!isServerEntry(this.environment, id)) return;

      if (code.includes("import.meta.hot.accept(")) return;

      const s = new MagicString(code);

      const hmrCode = `
if (import.meta.hot) {
  import.meta.hot.accept();
}
`;

      s.append(hmrCode);

      return {
        code: s.toString(),
        map: s.generateMap({ hires: true }),
      };
    },
  };
}
