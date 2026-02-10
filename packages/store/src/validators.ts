import typia from "typia";
import type { EntryMeta } from "./types.js";

export const assertEntry = typia.createAssert<EntryMeta>();
