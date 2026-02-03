import userServerEntry from "virtual:ud:catch-all";
import { assertFetchable } from "@universal-deploy/store/utils";
import { type FetchHandler, type ServerMiddleware, serve as serveSrvx } from "srvx";

async function startServer() {
  assertFetchable(userServerEntry, "virtual:ud:catch-all");
  let { static: staticDir, prod } = userServerEntry as unknown as FetchHandler & {
    static?: boolean | string;
    prod?: boolean;
  };

  // @ts-expect-error replaced by node plugin
  if (__UD_STATIC__) staticDir = __UD_STATIC__;

  if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = prod ? "production" : "development";
  }

  if (staticDir === undefined || staticDir === true) {
    // TODO: awesome-framework should set this value to `dist/client` on the entry
    staticDir = "public";
  }

  const server = serveSrvx({
    ...userServerEntry,
    gracefulShutdown: Boolean(prod),
    middleware: [
      staticDir
        ? (await import("srvx/static")).serveStatic({
            dir: staticDir,
          })
        : undefined,
    ].filter(Boolean) as ServerMiddleware[],
  });

  await server.ready();
}

await startServer();
