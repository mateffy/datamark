// ============================================================================
// datamark/parse — AST query, extraction, and parsing utilities
// ============================================================================

export {
  parseBlocks,
  parseBody,
  buildSectionTree,
  type Document,
  type Node,
  type ParentNode,
  type SectionNode,
  type BlockNode,
  type InlineNode,
  type HeadingNode,
  type ParagraphNode,
  type CodeNode,
  type BlockquoteNode,
  type HrNode,
  type ListNode,
  type ListItemNode,
  type TableNode,
  type TableRowNode,
  type TableCellNode,
  type HtmlBlockNode,
  type SpaceNode,
  type TextNode,
  type EscapeNode,
  type StrongNode,
  type EmNode,
  type CodeSpanNode,
  type LinkNode,
  type ImageNode,
  type BreakNode,
  type DelNode,
  type InlineHtmlNode,
  isSection,
  isBlockNode,
  isInlineNode,
  isParentNode,
} from "./tree";

export {
  find,
  findAll,
  filter,
  sectionsAtDepth,
  sectionsByHeading,
  splitBy,
  between,
  after,
  before,
  codeBlocks,
  inlineText,
  textContent,
  flatten,
  isHeading,
  isCodeBlock,
  isTodoItem,
  extractTodoItems,
  type NodePredicate,
  type TodoItem,
} from "./tree-utils";

export {
  extractFrontmatter,
  splitFrontmatter,
  FrontmatterError,
} from "./frontmatter";

export { parseYaml, stringifyYaml, YamlParseError } from "./yaml";

export {
  validateData,
  ValidationError,
  type StandardSchemaV1,
} from "./validation";

export type { Position, SourceSpan } from "./position";
