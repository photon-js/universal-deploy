/** biome-ignore-all lint/suspicious/noExplicitAny: globalThis cast */
import type { EntryMeta, EntryTransformer, Store } from "./types.js";
import { assertEntry } from "./validators.js";

export type * from "./types.js";

const storeSymbol = Symbol.for("ud:store");
const transformerSymbol = Symbol.for("ud:transformer");
(globalThis as any)[storeSymbol] ||= { entries: [] } satisfies Store;
const store: Store = (globalThis as any)[storeSymbol];

export const catchAllEntry = "virtual:ud:catch-all" as const;

/**
 * Add a Fetchable server entry to the store
 */
export function addEntry(entry: EntryMeta) {
  const _entry = assertEntry(entry);
  // We silently ignore exact duplicates, as vite config file can be imported multiple times
  const existing = new Set(store.entries.map((e) => JSON.stringify(e)));
  if (existing.has(JSON.stringify(_entry))) return;
  store.entries.push(_entry);
}

/**
 * Retrieve all server entries
 */
export function getAllEntries(): readonly EntryMeta[] {
  const transformer: EntryTransformer | undefined = (globalThis as any)[transformerSymbol];
  const entries = [...store.entries];
  return Object.freeze(transformer ? entries.map(transformer) : entries);
}

/**
 * @experimental
 */
export function setEntryTransformer(transformer: EntryTransformer) {
  (globalThis as any)[transformerSymbol] = transformer;
}
