/**
 * Emit runner and producing combinators.
 *
 * The emit runner executes a generator function where each `yield*`
 * expression adds nodes to an accumulating document. The runner
 * produces a final Markdown string.
 */

import type {
  BlockNode,
  Document,
  HeadingNode,
  ParagraphNode,
  CodeNode,
  InlineNode,
  HrNode,
  SpaceNode,
} from "../tree";
import { parseBody } from "../tree";
import { stringify as stringifyDocument } from "../document";
import type { EmitContext, Yieldable } from "./types";
import { createEmitYieldable, getYieldableEmit } from "./yieldable";

// ============================================================================
// Emit Runner
// ============================================================================

/**
 * Create a stringifier from a generator function.
 *
 * The generator receives an `EmitContext` and the data object, then
 * uses `yield*` with emit combinators to build the output document.
 *
 * @example
 * ```typescript
 * const stringifyPlan = emit(function* (doc, data) {
 *   yield* doc.emitFrontmatter({ id: data.id, title: data.title });
 *   yield* heading(1, data.title);
 *   for (const step of data.steps) {
 *     yield* heading(2, "Step");
 *     yield* markdown(step.description);
 *   }
 * });
 * ```
 */
export function emit<T>(
  fn: (doc: EmitContext, data: T) => Generator<Yieldable<unknown>, void, unknown>
): (data: T) => string {
  return (data: T) => {
    const nodes: BlockNode[] = [];
    let frontmatter: Record<string, unknown> | null = null;

    const ctx: EmitContext = {
      emitFrontmatter(data) {
        return createEmitYieldable("emitFrontmatter", () => {
          frontmatter = data;
        });
      },

      emitNode(node) {
        nodes.push(node);
      },

      toDocument(): Document {
        return {
          type: "document",
          frontmatter,
          children: nodes,
        };
      },
    };

    const gen = fn(ctx, data);
    let step = gen.next();

    while (!step.done) {
      const yieldable = step.value;
      const emitFn = getYieldableEmit(yieldable);
      if (!emitFn) {
        throw new Error(
          `Unknown yieldable in emit generator: ${yieldable._tag}`
        );
      }
      emitFn(ctx);
      step = gen.next();
    }

    return stringifyDocument(ctx.toDocument());
  };
}

// ============================================================================
// Emit Combinators
// ============================================================================

function textNode(value: string): InlineNode {
  return { type: "text", value, raw: value };
}

function spaceNode(): SpaceNode {
  return { type: "space", raw: "\n" };
}

/**
 * Emit a heading node.
 */
export function heading(depth: number, text: string): Yieldable<void> {
  const raw = "#".repeat(depth) + " " + text;
  const node: HeadingNode = {
    type: "heading",
    depth,
    children: [textNode(text)],
    raw,
  };
  return createEmitYieldable("heading", (ctx) => {
    ctx.emitNode(node);
  });
}

/**
 * Emit a paragraph node.
 */
export function paragraph(text: string): Yieldable<void> {
  const node: ParagraphNode = {
    type: "paragraph",
    children: [textNode(text)],
    raw: text,
  };
  return createEmitYieldable("paragraph", (ctx) => {
    ctx.emitNode(node);
  });
}

/**
 * Emit a code block.
 */
export function codeBlock(lang: string, code: string): Yieldable<void> {
  const meta = lang.includes(" ") ? lang.split(" ").slice(1).join(" ") : undefined;
  const language = lang.includes(" ") ? lang.split(" ")[0]! : lang;
  const raw = "```" + lang + "\n" + code + "\n```";
  const node: CodeNode = {
    type: "code",
    lang: language || undefined,
    meta,
    value: code,
    raw,
  };
  return createEmitYieldable("codeBlock", (ctx) => {
    ctx.emitNode(node);
  });
}

/**
 * Emit a horizontal rule.
 */
export function hr(): Yieldable<void> {
  const node: HrNode = { type: "hr", raw: "---" };
  return createEmitYieldable("hr", (ctx) => {
    ctx.emitNode(node);
  });
}

/**
 * Emit raw Markdown text as nodes.
 *
 * Parses the text into block nodes and emits them.
 */
export function markdown(text: string): Yieldable<void> {
  return createEmitYieldable("markdown", (ctx) => {
    const parsedNodes = parseBody(text);
    for (const node of parsedNodes) {
      ctx.emitNode(node);
    }
  });
}

/**
 * Emit a todo list item as a list node.
 */
export function todoItem(text: string, completed: boolean): Yieldable<void> {
  return createEmitYieldable("todoItem", (ctx) => {
    const prefix = completed ? "[x] " : "[ ] ";
    const raw = "- " + prefix + text;
    const para: ParagraphNode = {
      type: "paragraph",
      children: [textNode(prefix + text)],
      raw: prefix + text,
    };
    const node = {
      type: "list" as const,
      ordered: false,
      items: [[para] as BlockNode[]],
      raw,
    };
    ctx.emitNode(node);
  });
}
