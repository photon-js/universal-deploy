import type { Plugin } from "vite";
import { awesomeFrameworkPlugin } from "./awesomeFrameworkPlugin";
import { universalDeployPlugin } from "./universalDeployPlugin";

export function awesomeFramework(): Plugin[] {
  return [...awesomeFrameworkPlugin(), ...universalDeployPlugin()];
}
