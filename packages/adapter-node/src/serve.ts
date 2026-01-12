import userServerEntry from "virtual:ud:catch-all";
import { assertFetchable } from "@universal-deploy/store/utils";
import sirv from "@universal-middleware/sirv/srvx";
import { serve as serveSrvx } from "srvx";

function startServer() {
  assertFetchable(userServerEntry, "virtual:ud:catch-all");

  return serveSrvx({
    ...userServerEntry,
    middleware: [sirv("dist/client")],
  }).ready();
}

await startServer();
