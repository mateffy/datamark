// ============================================================================
// @datamark/changelog — Predefined changelog formats
// ============================================================================

export { keepAChangelog } from "./keep-a-changelog";
export { conventionalChangelog } from "./conventional-changelog";
export { githubReleases } from "./github-releases";
export { commonChangelog } from "./common-changelog";

export type {
  Changelog,
  Release,
  Change,
  ChangeCategory,
} from "./types";

export {
  extractVersionInfo,
  classifyCategory,
  parseChangeItems,
  parseChangeItem,
  buildChangesMarkdown,
  buildVersionHeading,
  buildCategoryHeading,
  emptyCategories,
  extractFootnoteReferences,
  findH1Section,
  extractPreamble,
  extractVersionSummary,
  headingRawText,
} from "./utils";
