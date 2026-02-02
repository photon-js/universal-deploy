import type { Plugin } from "vite";
import { awesomeFrameworkPlugin } from "./awesomeFrameworkPlugin.js";
import type { Options } from "./types.js";
import { universalDeployPlugin } from "./universalDeployPlugin.js";

export function awesomeFramework(options?: Options): Plugin[] {
  return [...awesomeFrameworkPlugin(), ...universalDeployPlugin(options)];
}
