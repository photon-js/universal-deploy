import { createMiddleware } from "@universal-middleware/express";
import type { Environment, FetchableDevEnvironment, Plugin, RunnableDevEnvironment, ViteDevServer } from "vite";
import { catchAllEntry } from "../index.js";
import { assertFetchable, type Fetchable } from "../utils.js";

// Vite's isRunnableDevEnvironment isn't reliable when multiple Vite versions are installed
export function isRunnableDevEnvironment(environment: Environment): environment is RunnableDevEnvironment {
  return "runner" in environment;
}

export function isFetchableDevEnvironment(environment: Environment): environment is FetchableDevEnvironment {
  return "dispatchFetch" in environment;
}

/**
 * Resolves catch-all entry and forwards incoming requests to its `fetch()` handler.
 */
export function devServer(): Plugin {
  // TODO HMR
  return {
    name: "universal-deploy:dev-server",
    apply(_config, { command, mode }) {
      return command === "serve" && mode !== "test";
    },
    configureServer(server) {
      return () => {
        const ssr = server.environments.ssr;
        let mod: Fetchable | undefined;

        async function devMiddleware(request: Request) {
          if (isRunnableDevEnvironment(ssr)) {
            if (!mod) {
              const resolved = await ssr.pluginContainer.resolveId(catchAllEntry);

              if (!resolved?.id) {
                throw new Error(`Could not resolve server entry ${catchAllEntry}`);
              }

              mod = await envImportFetchable(ssr, resolved.id);
            }
            const res = await mod.fetch(request);
            return applyViteTransformIndexHtml(server, res);
          } else if (isFetchableDevEnvironment(ssr)) {
            // TODO to be tested
            const res = await ssr.dispatchFetch(request);
            return applyViteTransformIndexHtml(server, res);
          }
        }

        server.middlewares.use(createMiddleware(() => devMiddleware)());
      };
    },
  };
}

async function applyViteTransformIndexHtml(viteServer: ViteDevServer, response: Response) {
  const contentType = response.headers.get("content-type") || "";

  // Only transform HTML responses
  if (!contentType.includes("text/html")) {
    return response;
  }

  const html = await response.text();
  const transformedHtml = await viteServer.transformIndexHtml(response.url, html);

  // Clone headers and update content-length if present
  const headers = new Headers(response.headers);
  headers.delete("content-length");

  return new Response(transformedHtml, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

async function envImportFetchable(env: RunnableDevEnvironment, resolvedId: string): Promise<Fetchable> {
  const mod = await env.runner.import<unknown>(resolvedId);
  return assertFetchable(mod, resolvedId);
}
