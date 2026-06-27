export {
  extractFrontmatter,
  splitFrontmatter,
  FrontmatterError,
} from "./frontmatter";

export { parseYaml, stringifyYaml, YamlParseError } from "./yaml";

export {
  parse,
  stringify,
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
  ValidationError,
  type StandardSchemaV1,
} from "./validation";

// Position tracking
export type { Position, SourceSpan } from "./position";

// Format SDK
export {
  datamark,
  parse as parseTemplate,
  emit as emitTemplate,
  heading,
  paragraph,
  codeBlock,
  optional,
  many,
  repeat,
  until,
  rest,
  splitBy as splitByCombinator,
  getCombinator,
  section,
  any,
  all,
  except,
  todo,
  markdown,
  todoItem,
  hr,
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
