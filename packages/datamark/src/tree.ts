import { Lexer, type Token } from "marked";
import type { SourceSpan } from "./position";
import { buildNewlineIndex, offsetToPosition } from "./position";

// ============================================================================
// Position mixin
// ============================================================================

export interface WithPosition {
  /** Source location in the original markdown string. */
  position?: SourceSpan;
}

// ============================================================================
// Inline nodes (children of block nodes that contain text)
// ============================================================================

export interface TextNode extends WithPosition {
  type: "text";
  value: string;
  raw: string;
}

export interface EscapeNode extends WithPosition {
  type: "escape";
  value: string;
  raw: string;
}

export interface StrongNode extends WithPosition {
  type: "strong";
  children: InlineNode[];
  raw: string;
}

export interface EmNode extends WithPosition {
  type: "em";
  children: InlineNode[];
  raw: string;
}

export interface CodeSpanNode extends WithPosition {
  type: "codespan";
  value: string;
  raw: string;
}

export interface LinkNode extends WithPosition {
  type: "link";
  href: string;
  title?: string;
  children: InlineNode[];
  raw: string;
}

export interface ImageNode extends WithPosition {
  type: "image";
  src: string;
  title?: string;
  alt: string;
  raw: string;
}

export interface BreakNode extends WithPosition {
  type: "br";
  raw: string;
}

export interface DelNode extends WithPosition {
  type: "del";
  children: InlineNode[];
  raw: string;
}

export interface InlineHtmlNode extends WithPosition {
  type: "html";
  value: string;
  raw: string;
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
// Block nodes
// ============================================================================

export interface HeadingNode extends WithPosition {
  type: "heading";
  depth: number;
  children: InlineNode[];
  raw: string;
}

export interface ParagraphNode extends WithPosition {
  type: "paragraph";
  children: InlineNode[];
  raw: string;
}

export interface CodeNode extends WithPosition {
  type: "code";
  lang?: string;
  meta?: string;
  value: string;
  raw: string;
}

export interface BlockquoteNode extends WithPosition {
  type: "blockquote";
  children: BlockNode[];
  raw: string;
}

export interface HrNode extends WithPosition {
  type: "hr";
  raw: string;
}

export interface ListNode extends WithPosition {
  type: "list";
  ordered: boolean;
  start?: number;
  items: BlockNode[][];
  raw: string;
}

export interface HtmlBlockNode extends WithPosition {
  type: "html";
  value: string;
  raw: string;
}

export interface TableCellNode extends WithPosition {
  children: InlineNode[];
  raw: string;
}

export interface TableNode extends WithPosition {
  type: "table";
  header: TableCellNode[];
  rows: TableCellNode[][];
  align: Array<"left" | "center" | "right" | null>;
  raw: string;
}

export interface SpaceNode extends WithPosition {
  type: "space";
  raw: string;
}

export type BlockNode =
  | HeadingNode
  | ParagraphNode
  | CodeNode
  | BlockquoteNode
  | HrNode
  | ListNode
  | HtmlBlockNode
  | TableNode
  | SpaceNode;

// ============================================================================
// Document
// ============================================================================

export interface Document {
  type: "document";
  frontmatter: Record<string, unknown> | null;
  title: string | null;
  children: BlockNode[];
}

/**
 * Internal state for tracking positions through the original text.
 */
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

/**
 * Parse a markdown body string into a tree of BlockNodes.
 * Uses `marked` internally but is not exposed in the API.
 *
 * When `parentText` is provided, positions are computed relative to the
 * full parent text at the given base offset. This allows accurate line/column
 * tracking when the body is a slice of a larger document.
 */
export function parseBody(body: string, parentText?: string, baseOffset: number = 0): BlockNode[] {
  const lexer = new Lexer();
  const tokens = lexer.lex(body);
  const state: PosState = {
    parentText: parentText ?? body,
    newlineIndex: buildNewlineIndex(parentText ?? body),
    offset: baseOffset,
  };
  return convertBlockTokens(tokens, state);
}

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
        // Fallback for unknown inline token types
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
        const items = (t.items ?? []).map((item: any): BlockNode[] => {
          const itemTokens = item.tokens ?? [];
          // Check if any token is a block-level token
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
          if (hasBlock) {
            return convertBlockTokens(itemTokens, state);
          }
          // Otherwise wrap inline tokens in a paragraph
          return [
            {
              type: "paragraph",
              children: convertInlineTokens(itemTokens, state),
              raw: item.raw ?? "",
              position: item.raw ? advance(state, item.raw) : undefined,
            },
          ];
        });
        return {
          type: "list",
          ordered: t.ordered ?? false,
          start: t.start ? Number(t.start) || undefined : undefined,
          items,
          raw: t.raw,
          position: span,
        };
      }
      case "html":
        return { type: "html", value: t.text ?? "", raw: t.raw, position: span };
      case "table": {
        const header: TableCellNode[] = (t.header ?? []).map((cell: any) => {
          const cellSpan = advance(state, cell.raw ?? "");
          return {
            children: convertInlineTokens(cell.tokens ?? [], state),
            raw: cell.raw ?? "",
            position: cellSpan,
          };
        });
        const rows: TableCellNode[][] = (t.rows ?? []).map((row: any[]) =>
          row.map((cell: any) => {
            const cellSpan = advance(state, cell.raw ?? "");
            return {
              children: convertInlineTokens(cell.tokens ?? [], state),
              raw: cell.raw ?? "",
              position: cellSpan,
            };
          })
        );
        return {
          type: "table",
          header,
          rows,
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
