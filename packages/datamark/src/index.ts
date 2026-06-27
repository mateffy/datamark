// ============================================================================
// datamark — Core format system
//
//   import { datamark, parse, stringify } from "datamark";
//   import { find, inlineText, ... } from "datamark/parse";
//   import { heading, paragraph, ... } from "datamark/stringify";
// ============================================================================

export { parse, stringify } from "./document";

export {
  datamark,
  type Format,
  type FormatConfig,
  type FormatDocs,
  type FormatExample,
  type TestResult,
  type DocumentWithFrontmatter,
} from "./format";

export type { Document } from "./tree";
