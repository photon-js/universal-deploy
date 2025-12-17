import type { Plugin } from "vite";
import { awesomeFrameworkPlugin } from "./awesomeFrameworkPlugin.js";
import { universalDeployPlugin } from "./universalDeployPlugin.js";

export function awesomeFramework(): Plugin[] {
  return [...awesomeFrameworkPlugin(), ...universalDeployPlugin()];
}
