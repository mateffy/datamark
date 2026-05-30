/**
 * Parse runner and consuming combinators.
 *
 * The parse runner executes a generator function where each `yield*`
 * expression triggers a combinator against the remaining document nodes.
 * The generator's return value becomes the final parsed object.
 */

import type { BlockNode, Document, HeadingNode, ParagraphNode, CodeNode } from "../tree";
import { parse as parseDocument } from "../document";
import { isHeading, isCodeBlock } from "../tree-utils";
import type {
  Combinator,
  CombinatorResult,
  NodePredicate,
  ParseContext,
  Yieldable,
} from "./types";
import { TemplateParseError } from "./types";
import { createYieldable, getYieldableRun } from "./yieldable";

// ============================================================================
// Parse Runner
// ============================================================================

/**
 * Create a parser from a generator function.
 *
 * The generator receives a `ParseContext` and uses `yield*` with
 * combinators to consume the document. The generator's `return`
 * value becomes the parser result.
 *
 * @example
 * ```typescript
 * const parsePlan = parse(function* (doc) {
 *   const frontmatter = yield* doc.consumeFrontmatter();
 *   const title = (yield* doc.consume(heading(1))).text;
 *   const sections = yield* doc.consume(splitBy(heading(2)));
 *   return { title, sections };
 * });
 * ```
 */
export function parse<T>(
  fn: (doc: ParseContext) => Generator<Yieldable<unknown>, T, unknown>
): (content: string) => T {
  return (content: string) => {
    const document = parseDocument(content);
    let remaining = document.children;
    let frontmatterConsumed = false;

    const ctx: ParseContext = {
      document,
      get remaining() {
        return remaining;
      },

      consumeFrontmatter() {
        return createYieldable(
          "consumeFrontmatter",
          "consumeFrontmatter",
          () => {
            if (frontmatterConsumed) {
              return { value: document.frontmatter, remaining };
            }
            frontmatterConsumed = true;
            return { value: document.frontmatter, remaining };
          }
        );
      },

      consume<T>(matcher: NodeMatcher<T> | Combinator<T>): Yieldable<T> {
        const combinator =
          typeof matcher === "function" && CombinatorSymbol in matcher
            ? (matcher as NodeMatcher<T>)[CombinatorSymbol]
            : (matcher as Combinator<T>);

        const name =
          typeof matcher === "function" && CombinatorSymbol in matcher
            ? (matcher as any)._combinatorName ?? "consume"
            : "consume";

        return createYieldable("consume", name, () => {
          const result = combinator(remaining);
          if (result === null) {
            throw new TemplateParseError(
              `Parse combinator failed at position ${estimatePosition(remaining)}`
            );
          }
          remaining = result.remaining;
          return result;
        });
      },
    };

    const gen = fn(ctx);
    let step = gen.next();

    while (!step.done) {
      const yieldable = step.value;
      const run = getYieldableRun(yieldable);
      if (!run) {
        throw new TemplateParseError(
          `Unknown yieldable in parse generator: ${yieldable._tag}`
        );
      }
      const result = run(ctx);
      if (result === null) {
        throw new TemplateParseError(
          `Parse combinator "${yieldable._tag}" failed at position ${estimatePosition(remaining)}`
        );
      }
      remaining = result.remaining;
      step = gen.next(result.value);
    }

    return step.value;
  };
}

function estimatePosition(nodes: BlockNode[]): string {
  if (nodes.length === 0) return "(end of document)";
  const first = nodes[0]!;
  const preview =
    "raw" in first ? first.raw.slice(0, 40) : String(first.type);
  return `"${preview.replace(/\n/g, "\\n")}"`;
}

// ============================================================================
// Node Matchers (callable as predicates, usable as combinators)
// ============================================================================

const CombinatorSymbol = Symbol.for("datamark.combinator");

/** A callable predicate that also carries a combinator for consumption. */
export interface NodeMatcher<T> extends NodePredicate {
  readonly [CombinatorSymbol]: Combinator<T>;
}

function createMatcher<T>(
  name: string,
  predicate: NodePredicate,
  combinator: Combinator<T>
): NodeMatcher<T> {
  const matcher = Object.assign(predicate, {
    [CombinatorSymbol]: combinator,
    _combinatorName: name,
  });
  return matcher as NodeMatcher<T>;
}

/** Extract the combinator from a NodeMatcher, or return null. */
export function getCombinator<T>(
  matcher: NodeMatcher<T> | Combinator<T>
): Combinator<T> | null {
  if (typeof matcher === "function" && CombinatorSymbol in matcher) {
    return (matcher as NodeMatcher<T>)[CombinatorSymbol];
  }
  if (typeof matcher === "function") {
    return matcher as unknown as Combinator<T>;
  }
  return null;
}

// ============================================================================
// Primitive Matchers
// ============================================================================

/**
 * Match a heading at a specific depth.
 *
 * As a combinator: consumes the first matching heading.
 * As a predicate: tests if a node is a heading of the given depth.
 */
export function heading(depth: number): NodeMatcher<HeadingNode> {
  const predicate = (n: BlockNode) => isHeading(n, depth);
  const combinator: Combinator<HeadingNode> = (nodes) => {
    const idx = nodes.findIndex(predicate);
    if (idx === -1) return null;
    return {
      value: nodes[idx] as HeadingNode,
      remaining: nodes.slice(idx + 1),
    };
  };
  return createMatcher(`heading(${depth})`, predicate, combinator);
}

/**
 * Match any paragraph.
 */
export function paragraph(): NodeMatcher<ParagraphNode> {
  const predicate = (n: BlockNode) => n.type === "paragraph";
  const combinator: Combinator<ParagraphNode> = (nodes) => {
    const idx = nodes.findIndex(predicate);
    if (idx === -1) return null;
    return {
      value: nodes[idx] as ParagraphNode,
      remaining: nodes.slice(idx + 1),
    };
  };
  return createMatcher("paragraph()", predicate, combinator);
}

/**
 * Match a code block, optionally filtered by language.
 */
export function codeBlock(
  options?: { lang?: string }
): NodeMatcher<CodeNode> {
  const predicate = (n: BlockNode) => isCodeBlock(n, options?.lang);
  const combinator: Combinator<CodeNode> = (nodes) => {
    const idx = nodes.findIndex(predicate);
    if (idx === -1) return null;
    return {
      value: nodes[idx] as CodeNode,
      remaining: nodes.slice(idx + 1),
    };
  };
  const name = options?.lang ? `codeBlock({ lang: "${options.lang}" })` : "codeBlock()";
  return createMatcher(name, predicate, combinator);
}

// ============================================================================
// Combinator Modifiers
// ============================================================================

/**
 * Make a combinator optional. Returns the value, or `undefined` if it
 * does not match.
 */
export function optional<T>(
  matcher: NodeMatcher<T> | Combinator<T>
): Combinator<T | undefined> {
  const combinator = getCombinator(matcher) ?? (matcher as Combinator<T>);

  return (nodes) => {
    const result = combinator(nodes);
    if (result === null) {
      return { value: undefined, remaining: nodes };
    }
    return result;
  };
}

/**
 * Run a combinator repeatedly until it fails. Returns all matches.
 */
export function many<T>(
  matcher: NodeMatcher<T> | Combinator<T>
): Combinator<T[]> {
  const combinator = getCombinator(matcher) ?? (matcher as Combinator<T>);

  return (nodes) => {
    const values: T[] = [];
    let remaining = nodes;
    while (true) {
      const result = combinator(remaining);
      if (result === null) break;
      values.push(result.value);
      remaining = result.remaining;
    }
    return { value: values, remaining };
  };
}

/**
 * Run a combinator exactly `count` times. Fails if it cannot match enough.
 */
export function repeat<T>(
  count: number,
  matcher: NodeMatcher<T> | Combinator<T>
): Combinator<T[]> {
  const combinator = getCombinator(matcher) ?? (matcher as Combinator<T>);

  return (nodes) => {
    const values: T[] = [];
    let remaining = nodes;
    for (let i = 0; i < count; i++) {
      const result = combinator(remaining);
      if (result === null) return null;
      values.push(result.value);
      remaining = result.remaining;
    }
    return { value: values, remaining };
  };
}

// ============================================================================
// Structural Combinators
// ============================================================================

/**
 * Consume nodes until the predicate matches. Returns the consumed nodes
 * (excluding the matched node). The matched node is left in the remaining
 * nodes.
 */
export function until(predicate: NodePredicate): Combinator<BlockNode[]> {
  return (nodes) => {
    const idx = nodes.findIndex(predicate);
    if (idx === -1) {
      return { value: nodes, remaining: [] };
    }
    return {
      value: nodes.slice(0, idx),
      remaining: nodes.slice(idx),
    };
  };
}

/**
 * Split all remaining nodes by a predicate. Returns groups of nodes
 * separated by matching nodes (discarded). Consumes all remaining nodes.
 */
export function splitBy(predicate: NodePredicate): Combinator<BlockNode[][]> {
  return (nodes) => {
    const groups: BlockNode[][] = [];
    let current: BlockNode[] = [];

    for (const node of nodes) {
      if (predicate(node)) {
        if (current.length > 0) {
          groups.push(current);
          current = [];
        }
      } else {
        current.push(node);
      }
    }

    if (current.length > 0) {
      groups.push(current);
    }

    return { value: groups, remaining: [] };
  };
}

/**
 * Consume all remaining nodes into a single array. Always succeeds.
 */
export function rest(): Combinator<BlockNode[]> {
  return (nodes) => ({ value: nodes, remaining: [] });
}
