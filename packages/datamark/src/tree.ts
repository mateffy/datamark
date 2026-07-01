import { Lexer, type Token } from "marked";
import type { SourceSpan } from "./position";
import { buildNewlineIndex, offsetToPosition } from "./position";

// ============================================================================
// Base Node types
// ============================================================================

export interface Node {
  type: string;
  raw?: string;
  position?: SourceSpan;
}

export interface ParentNode extends Node {
  children: Node[];
}

// ============================================================================
// Structural nodes
// ============================================================================

export interface Document extends Node {
  type: "document";
  frontmatter: Record<string, unknown> | null;
  root: SectionNode;
}

export interface SectionNode extends ParentNode {
  type: "section";
  heading: HeadingNode | null;
  children: Node[];
}

// ============================================================================
// Inline nodes (children of block nodes that contain text)
// ============================================================================

export interface TextNode extends Node {
  type: "text";
  value: string;
}

export interface EscapeNode extends Node {
  type: "escape";
  value: string;
}

export interface StrongNode extends ParentNode {
  type: "strong";
  children: InlineNode[];
}

export interface EmNode extends ParentNode {
  type: "em";
  children: InlineNode[];
}

export interface CodeSpanNode extends Node {
  type: "codespan";
  value: string;
}

export interface LinkNode extends ParentNode {
  type: "link";
  href: string;
  title?: string;
  children: InlineNode[];
}

export interface ImageNode extends Node {
  type: "image";
  src: string;
  title?: string;
  alt: string;
}

export interface BreakNode extends Node {
  type: "br";
}

export interface DelNode extends ParentNode {
  type: "del";
  children: InlineNode[];
}

export interface InlineHtmlNode extends Node {
  type: "html";
  value: string;
}

export type InlineNode =
  | TextNode
  | EscapeNode
  | StrongNode
  | EmNode
  | CodeSpanNode
  | LinkNode
  | ImageNode
  | BreakNode
  | DelNode
  | InlineHtmlNode;

// ============================================================================
// Block content nodes
// ============================================================================

export interface HeadingNode extends ParentNode {
  type: "heading";
  depth: number;
  children: InlineNode[];
}

export interface ParagraphNode extends ParentNode {
  type: "paragraph";
  children: InlineNode[];
}

export interface CodeNode extends Node {
  type: "code";
  lang?: string;
  meta?: string;
  value: string;
}

export interface BlockquoteNode extends ParentNode {
  type: "blockquote";
  children: BlockNode[];
}

export interface HrNode extends Node {
  type: "hr";
}

export interface ListItemNode extends ParentNode {
  type: "listItem";
  children: BlockNode[];
}

export interface ListNode extends ParentNode {
  type: "list";
  ordered: boolean;
  start?: number;
  children: ListItemNode[];
}

export interface TableCellNode extends ParentNode {
  type: "tableCell";
  children: InlineNode[];
}

export interface TableRowNode extends ParentNode {
  type: "tableRow";
  children: TableCellNode[];
}

export interface TableNode extends ParentNode {
  type: "table";
  align: Array<"left" | "center" | "right" | null>;
  children: TableRowNode[];
}

export interface HtmlBlockNode extends Node {
  type: "html";
  value: string;
}

export interface SpaceNode extends Node {
  type: "space";
}

export type BlockNode =
  | HeadingNode
  | ParagraphNode
  | CodeNode
  | BlockquoteNode
  | HrNode
  | ListNode
  | TableNode
  | HtmlBlockNode
  | SpaceNode;

// ============================================================================
// Type guards
// ============================================================================

export function isSection(node: Node): node is SectionNode {
  return node.type === "section";
}

export function isBlockNode(node: Node): node is BlockNode {
  return (
    node.type === "heading" ||
    node.type === "paragraph" ||
    node.type === "code" ||
    node.type === "blockquote" ||
    node.type === "hr" ||
    node.type === "list" ||
    node.type === "table" ||
    node.type === "html" ||
    node.type === "space"
  );
}

export function isInlineNode(node: Node): node is InlineNode {
  return (
    node.type === "text" ||
    node.type === "escape" ||
    node.type === "strong" ||
    node.type === "em" ||
    node.type === "codespan" ||
    node.type === "link" ||
    node.type === "image" ||
    node.type === "br" ||
    node.type === "del" ||
    node.type === "html"
  );
}

export function isParentNode(node: Node): node is ParentNode {
  return "children" in node && Array.isArray((node as any).children);
}

// ============================================================================
// Position tracking
// ============================================================================

interface PosState {
  parentText: string;
  newlineIndex: number[];
  offset: number;
}

function advance(state: PosState, raw: string): SourceSpan {
  const idx = state.parentText.indexOf(raw, state.offset);
  const startOffset = idx === -1 ? state.offset : idx;
  const endOffset = startOffset + raw.length;
  const span: SourceSpan = {
    start: offsetToPosition(startOffset, state.newlineIndex),
    end: offsetToPosition(endOffset, state.newlineIndex),
  };
  state.offset = endOffset;
  return span;
}

// ============================================================================
// Parse: markdown string → flat BlockNode[]
// ============================================================================

/**
 * Parse a markdown body string into a flat array of BlockNodes.
 * Uses `marked` internally but is not exposed in the API.
 *
 * When `parentText` is provided, positions are computed relative to the
 * full parent text at the given base offset. This allows accurate line/column
 * tracking when the body is a slice of a larger document.
 */
export function parseBlocks(
  body: string,
  parentText?: string,
  baseOffset: number = 0
): BlockNode[] {
  const lexer = new Lexer();
  const tokens = lexer.lex(body);
  const state: PosState = {
    parentText: parentText ?? body,
    newlineIndex: buildNewlineIndex(parentText ?? body),
    offset: baseOffset,
  };
  return convertBlockTokens(tokens, state);
}

/** @deprecated Use `parseBlocks` instead */
export const parseBody = parseBlocks;

function convertInlineTokens(tokens: Token[], state: PosState): InlineNode[] {
  return tokens.map((t): InlineNode => {
    const span = advance(state, t.raw ?? "");
    switch (t.type) {
      case "text":
        return { type: "text", value: t.text ?? "", raw: t.raw, position: span };
      case "escape":
        return { type: "escape", value: t.text ?? "", raw: t.raw, position: span };
      case "strong":
        return {
          type: "strong",
          children: convertInlineTokens(t.tokens ?? [], state),
          raw: t.raw,
          position: span,
        };
      case "em":
        return {
          type: "em",
          children: convertInlineTokens(t.tokens ?? [], state),
          raw: t.raw,
          position: span,
        };
      case "codespan":
        return { type: "codespan", value: t.text ?? "", raw: t.raw, position: span };
      case "link":
        return {
          type: "link",
          href: t.href ?? "",
          title: t.title,
          children: convertInlineTokens(t.tokens ?? [], state),
          raw: t.raw,
          position: span,
        };
      case "image":
        return {
          type: "image",
          src: t.href ?? "",
          title: t.title,
          alt: t.text ?? "",
          raw: t.raw,
          position: span,
        };
      case "br":
        return { type: "br", raw: t.raw, position: span };
      case "del":
        return {
          type: "del",
          children: convertInlineTokens(t.tokens ?? [], state),
          raw: t.raw,
          position: span,
        };
      case "html":
        return { type: "html", value: t.text ?? "", raw: t.raw, position: span };
      default:
        return { type: "text", value: (t as any).text ?? t.raw ?? "", raw: t.raw, position: span };
    }
  });
}

function convertBlockTokens(tokens: Token[], state: PosState): BlockNode[] {
  return tokens.map((t): BlockNode => {
    const span = advance(state, t.raw ?? "");
    switch (t.type) {
      case "heading":
        return {
          type: "heading",
          depth: t.depth ?? 1,
          children: convertInlineTokens(t.tokens ?? [], state),
          raw: t.raw,
          position: span,
        };
      case "paragraph":
        return {
          type: "paragraph",
          children: convertInlineTokens(t.tokens ?? [], state),
          raw: t.raw,
          position: span,
        };
      case "code": {
        const langTag = (t.lang ?? "").trim();
        const parts = langTag.split(/\s+/);
        const lang = parts[0] || undefined;
        const meta = parts.slice(1).join(" ") || undefined;
        return {
          type: "code",
          lang,
          meta,
          value: t.text ?? "",
          raw: t.raw,
          position: span,
        };
      }
      case "blockquote":
        return {
          type: "blockquote",
          children: convertBlockTokens(t.tokens ?? [], state),
          raw: t.raw,
          position: span,
        };
      case "hr":
        return { type: "hr", raw: t.raw, position: span };
      case "list": {
        const items: ListItemNode[] = (t.items ?? []).map((item: any): ListItemNode => {
          const itemTokens = item.tokens ?? [];
          const blockTypes = new Set([
            "heading",
            "paragraph",
            "code",
            "blockquote",
            "hr",
            "list",
            "html",
            "table",
            "space",
          ]);
          const hasBlock = itemTokens.some((tok: any) => blockTypes.has(tok.type));
          const children = hasBlock
            ? convertBlockTokens(itemTokens, state)
            : (() => {
                // Flatten wrapped text tokens so inline elements (images, links,
                // strong, em) inside list items are parsed correctly.
                const flattened = itemTokens.flatMap((tok: any) =>
                  tok.type === "text" && tok.tokens ? tok.tokens : [tok]
                );
                const saved = state.offset;
                const paraChildren = convertInlineTokens(flattened, state);
                state.offset = saved;
                return [
                  {
                    type: "paragraph",
                    children: paraChildren,
                    raw: item.raw ?? "",
                    position: item.raw ? advance(state, item.raw) : undefined,
                  } as ParagraphNode,
                ];
              })();
          return {
            type: "listItem",
            children,
            raw: item.raw ?? "",
          };
        });
        return {
          type: "list",
          ordered: t.ordered ?? false,
          start: t.start ? Number(t.start) || undefined : undefined,
          children: items,
          raw: t.raw,
          position: span,
        };
      }
      case "html":
        return { type: "html", value: t.text ?? "", raw: t.raw, position: span };
      case "table": {
        const headerRow: TableRowNode = {
          type: "tableRow",
          children: (t.header ?? []).map((cell: any) => {
            const cellSpan = advance(state, cell.raw ?? "");
            return {
              type: "tableCell",
              children: convertInlineTokens(cell.tokens ?? [], state),
              raw: cell.raw ?? "",
              position: cellSpan,
            };
          }),
          raw: "",
        };
        const rows: TableRowNode[] = (t.rows ?? []).map((row: any[]) => ({
          type: "tableRow",
          children: row.map((cell: any) => {
            const cellSpan = advance(state, cell.raw ?? "");
            return {
              type: "tableCell",
              children: convertInlineTokens(cell.tokens ?? [], state),
              raw: cell.raw ?? "",
              position: cellSpan,
            };
          }),
          raw: "",
        }));
        return {
          type: "table",
          children: [headerRow, ...rows],
          align: t.align ?? [],
          raw: t.raw,
          position: span,
        };
      }
      case "space":
        return { type: "space", raw: t.raw, position: span };
      default:
        return { type: "space", raw: t.raw, position: span };
    }
  });
}

// ============================================================================
// Section tree builder
// ============================================================================

/**
 * Build a section tree from a flat array of BlockNodes.
 *
 * Headings become SectionNodes. The algorithm is single-pass, stack-based, O(n).
 *
 * - Content before the first heading stays in the root section.
 * - A heading at depth N creates a new SectionNode. The stack is popped
 *   until the top section has a heading depth < N, then the new section
 *   is appended as a child of that top section.
 */
export function buildSectionTree(nodes: BlockNode[]): SectionNode {
  const root: SectionNode = {
    type: "section",
    heading: null,
    children: [],
  };
  const stack: SectionNode[] = [root];

  for (const node of nodes) {
    if (node.type === "heading") {
      const depth = node.depth;
      while (stack.length > 1) {
        const topDepth = stack[stack.length - 1]!.heading?.depth ?? 0;
        if (topDepth < depth) break;
        stack.pop();
      }
      const parent = stack[stack.length - 1]!;
      const section: SectionNode = {
        type: "section",
        heading: node,
        children: [],
      };
      parent.children.push(section);
      stack.push(section);
    } else {
      stack[stack.length - 1]!.children.push(node);
    }
  }

  return root;
}
