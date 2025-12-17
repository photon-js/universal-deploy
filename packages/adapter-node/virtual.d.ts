declare module "virtual:photon:catch-all" {
  type FetchHandler = (request: Request) => Response | Promise<Response>;
  const handler: { fetch: FetchHandler };
  export default handler;
}
