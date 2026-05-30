export {
  extractFrontmatter,
  splitFrontmatter,
  FrontmatterError,
} from "./frontmatter";

export { parseYaml, stringifyYaml, YamlParseError } from "./yaml";

export {
  parse,
  stringify,
  type ParseOptions,
} from "./document";

export {
  parseBody,
  type Document,
  type BlockNode,
  type InlineNode,
  type HeadingNode,
  type ParagraphNode,
  type CodeNode,
  type BlockquoteNode,
  type HrNode,
  type ListNode,
  type HtmlBlockNode,
  type TableNode,
  type TableCellNode,
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
} from "./tree";

export {
  find,
  findAll,
  filter,
  sections,
  splitBy,
  between,
  after,
  before,
  codeBlocks,
  inlineText,
  textContent,
  toMarkdown,
  isHeading,
  isCodeBlock,
  isTodoItem,
  extractTodoItems,
  type NodePredicate,
  type Section,
  type TodoItem,
} from "./tree-utils";

export {
  validateData,
  validateFrontmatter,
  ValidationError,
  type StandardSchemaV1,
} from "./validation";

// Position tracking
export type { Position, SourceSpan } from "./position";

// Template system
export {
  datamark,
  parse as parseTemplate,
  emit as emitTemplate,
  heading as headingMatcher,
  paragraph as paragraphMatcher,
  codeBlock as codeBlockMatcher,
  optional,
  many,
  repeat,
  until,
  rest,
  splitBy as splitByCombinator,
  getCombinator,
  markdown as emitMarkdown,
  todoItem,
  hr as emitHr,
  type Format,
  type FormatConfig,
  type ParseContext,
  type EmitContext,
  type Combinator,
  type CombinatorResult,
  type NodeMatcher,
  type TemplateParseError,
  type Yieldable,
  type ParseTrace,
  type TraceStep,
  type FormatDocs,
  type DocsStep,
  type FormatExample,
  type TestResult,
  type TestFailure,
} from "./template";
