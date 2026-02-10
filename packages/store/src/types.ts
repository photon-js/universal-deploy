export interface Store {
  entries: EntryMeta[];
}

export interface EntryMeta {
  /**
   * Module id for this entry. Can be a filesystem path, or a virtual module.
   */
  id: string;
  /**
   * If undefined, matches any HTTP method.
   */
  method?: HttpMethod | HttpMethod[];
  /**
   * Route pattern(s) for this entry.
   *
   * Should be a valid {@link https://github.com/h3js/rou3 | rou3} pattern.
   */
  route: string | string[];
  /**
   * The Vite environment this entry belongs to.
   *
   * @default ssr
   */
  environment?: string;
}

type HttpMethod = "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "CONNECT" | "OPTIONS" | "TRACE" | "PATCH";

export type EntryTransformer = (entry: EntryMeta) => EntryMeta;
