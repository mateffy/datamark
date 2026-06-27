/**
 * Parse runner and consuming combinators.
 *
 * The parse runner executes a generator function where each `yield*`
 * expression triggers a combinator against the remaining document nodes.
 * The generator's return value becomes the final parsed object.
 */

import type {
  BlockNode,
  Document,
  HeadingNode,
  ParagraphNode,
  CodeNode,
  HrNode,
  ListNode,
} from "../tree";
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

/** Check if a value is a generator function. */
export function isGeneratorFunction(fn: unknown): fn is (...args: any[]) => Generator<any, any, any> {
  return typeof fn === "function" && fn.constructor?.name === "GeneratorFunction";
}

/** Check if a value is an array of arrays of BlockNode (chunking result). */
export function isChunkingResult(value: unknown): value is BlockNode[][] {
  if (!Array.isArray(value)) return false;
  if (value.length === 0) return false;
  // Check if first element is an array of BlockNode
  const first = value[0];
  if (!Array.isArray(first)) return false;
  if (first.length === 0) return true; // Empty sub-arrays count as chunking
  const firstNode = first[0];
  return firstNode && typeof firstNode === "object" && "type" in firstNode;
}

/** Test if a function is a NodePredicate by checking its return type. */
export function isNodePredicate(fn: Function): boolean {
  const testNode: BlockNode = { type: "space", raw: "\n" };
  try {
    const result = fn(testNode);
    return typeof result === "boolean";
  } catch {
    return false;
  }
}

/**
 * Create a sub-context for running a generator on a slice of nodes.
 */
function createSubContext(
  document: Document,
  nodes: BlockNode[],
  parentCtx: ParseContext,
  contextName: string
): ParseContext {
  let subRemaining = nodes;
  let subFrontmatterCalled = false;

  return {
    document,
    get remaining() {
      return subRemaining;
    },

    frontmatter() {
      return createYieldable("frontmatter", "frontmatter", () => {
        return { value: document.frontmatter, remaining: subRemaining };
      });
    },

    consume<T, R = T>(
      matcher: Combinator<T> | NodePredicate,
      transform?:
        | ((value: T) => R)
        | ((doc: ParseContext) => Generator<Yieldable<unknown>, R, unknown>)
    ): Yieldable<R | T> {
      return makeConsumeYieldable(
        matcher,
        transform,
        subRemaining,
        contextName,
        (newRemaining) => {
          subRemaining = newRemaining;
        },
        false
      );
    },

    peek<T, R = T>(
      matcher: Combinator<T> | NodePredicate,
      transform?:
        | ((value: T) => R)
        | ((doc: ParseContext) => Generator<Yieldable<unknown>, R, unknown>)
    ): Yieldable<R | T> {
      return makeConsumeYieldable(
        matcher,
        transform,
        subRemaining,
        contextName,
        () => {
          // peek doesn't advance
        },
        true
      );
    },
  };
}

/**
 * Run a generator in a sub-context and return its result.
 */
export function runGenerator<T>(
  generator: (doc: ParseContext) => Generator<Yieldable<unknown>, T, unknown>,
  subCtx: ParseContext
): T {
  const gen = generator(subCtx);
  let step = gen.next();

  while (!step.done) {
    const yieldable = step.value;
    const run = getYieldableRun(yieldable);
    if (!run) {
      throw new TemplateParseError(
        `Unknown yieldable in sub-context generator: ${yieldable._tag}`
      );
    }
    const result = run(subCtx);
    if (result === null) {
      throw new TemplateParseError(
        `Combinator "${yieldable._tag}" failed in sub-context`
      );
    }
    // For sub-context consume/peek, we need to update remaining via side effect
    // The subCtx's consume/peek already updates subRemaining internally
    step = gen.next(result.value);
  }

  return step.value;
}

/**
 * Create a Yieldable for consume() or peek() with optional transform.
 */
export function makeConsumeYieldable<T, R>(
  matcher: Combinator<T> | NodePredicate,
  transform:
    | undefined
    | ((value: T) => R)
    | ((doc: ParseContext) => Generator<Yieldable<unknown>, R, unknown>),
  nodes: BlockNode[],
  contextName: string,
  advanceCursor: (newRemaining: BlockNode[]) => void,
  isPeek: boolean = false
): Yieldable<R | T> {
  // Resolve matcher to combinator
  let combinator: Combinator<T>;
  let combinatorName: string;

  if (typeof matcher === "function" && CombinatorSymbol in matcher) {
    combinator = (matcher as NodeMatcher<T>)[CombinatorSymbol];
    combinatorName = (matcher as any)._combinatorName ?? "consume";
  } else if (typeof matcher === "function" && isNodePredicate(matcher)) {
    // NodePredicate: auto-wrap into "consume first matching node"
    const predicate = matcher as NodePredicate;
    combinatorName = "predicate";
    combinator = ((ns: BlockNode[]) => {
      const idx = ns.findIndex(predicate);
      if (idx === -1) return null;
      return {
        value: ns[idx] as unknown as T,
        remaining: ns.slice(idx + 1),
      };
    }) as Combinator<T>;
  } else {
    combinator = matcher as Combinator<T>;
    combinatorName = (matcher as any)._combinatorName ?? "consume";
  }

  const hasTransform = transform !== undefined;
  const isGenTransform = hasTransform && isGeneratorFunction(transform);
  const tag = isGenTransform ? "consume(sub-context)" : hasTransform ? "consume(transform)" : "consume";

  return createYieldable(tag, combinatorName, () => {
    const result = combinator(nodes);
    if (result === null) {
      throw new TemplateParseError(
        `Parse combinator failed at position ${estimatePosition(nodes)}`
      );
    }

    // Advance cursor
    advanceCursor(result.remaining);

    const outRemaining = isPeek ? nodes : result.remaining;

    if (!hasTransform) {
      return { value: result.value as R | T, remaining: outRemaining };
    }

    if (!isGenTransform) {
      // Plain transform function
      const transformed = (transform as (value: T) => R)(result.value);
      return {
        value: transformed as R | T,
        remaining: outRemaining,
      };
    }

    // Generator transform: create sub-context(s)
    const generator = transform as (doc: ParseContext) => Generator<Yieldable<unknown>, R, unknown>;

    if (isChunkingResult(result.value)) {
      // Chunking combinator (e.g. section(2) → BlockNode[][])
      // Run generator on each chunk, collect results
      const chunks = result.value as unknown as BlockNode[][];
      const collected: R[] = [];
      for (const chunk of chunks) {
        const subCtx = createSubContext(
          { type: "document", frontmatter: null, children: chunk } as Document,
          chunk,
          {} as ParseContext,
          contextName
        );
        const subResult = runGenerator(generator, subCtx);
        collected.push(subResult);
      }
      return {
        value: collected as unknown as R | T,
        remaining: outRemaining,
      };
    } else {
      // Flat combinator result: single sub-context
      const subCtx = createSubContext(
        { type: "document", frontmatter: null, children: result.value as unknown as BlockNode[] } as Document,
        result.value as unknown as BlockNode[],
        {} as ParseContext,
        contextName
      );
      const subResult = runGenerator(generator, subCtx);
      return {
        value: subResult as unknown as R | T,
        remaining: outRemaining,
      };
    }
  });
}

/**
 * Create a parser from a generator function.
 */
export function parse<T>(
  fn: (doc: ParseContext) => Generator<Yieldable<unknown>, T, unknown>
): (content: string) => T {
  return (content: string) => {
    const document = parseDocument(content);
    let remaining = document.children;
    let frontmatterCalled = false;

    const ctx: ParseContext = {
      document,
      get remaining() {
        return remaining;
      },

      frontmatter() {
        return createYieldable("frontmatter", "frontmatter", () => {
          return { value: document.frontmatter, remaining };
        });
      },

      consume<T, R = T>(
        matcher: Combinator<T> | NodePredicate,
        transform?:
          | ((value: T) => R)
          | ((doc: ParseContext) => Generator<Yieldable<unknown>, R, unknown>)
      ): Yieldable<R | T> {
        return makeConsumeYieldable(
          matcher,
          transform,
          remaining,
          "root",
          (newRemaining) => {
            remaining = newRemaining;
          },
          false
        );
      },

      peek<T, R = T>(
        matcher: Combinator<T> | NodePredicate,
        transform?:
          | ((value: T) => R)
          | ((doc: ParseContext) => Generator<Yieldable<unknown>, R, unknown>)
      ): Yieldable<R | T> {
        return makeConsumeYieldable(
          matcher,
          transform,
          remaining,
          "root",
          () => {
            // peek doesn't advance root cursor
          },
          true
        );
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
// Primitive Matchers
// ============================================================================

/**
 * Match a heading at a specific depth.
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

/**
 * Match a horizontal rule.
 */
export function hr(): NodeMatcher<HrNode> {
  const predicate = (n: BlockNode) => n.type === "hr";
  const combinator: Combinator<HrNode> = (nodes) => {
    const idx = nodes.findIndex(predicate);
    if (idx === -1) return null;
    return {
      value: nodes[idx] as HrNode,
      remaining: nodes.slice(idx + 1),
    };
  };
  return createMatcher("hr()", predicate, combinator);
}

/**
 * Match a todo list node.
 */
export function todo(): NodeMatcher<ListNode> {
  const predicate = (n: BlockNode) => {
    if (n.type !== "list") return false;
    return n.items.every((item) => {
      const first = item[0];
      if (!first || first.type !== "paragraph") return false;
      const text = first.children.map((c) => (c.type === "text" ? c.value : "")).join("");
      return /^\[[ xX]\]\s/.test(text);
    });
  };
  const combinator: Combinator<ListNode> = (nodes) => {
    const idx = nodes.findIndex(predicate);
    if (idx === -1) return null;
    return {
      value: nodes[idx] as ListNode,
      remaining: nodes.slice(idx + 1),
    };
  };
  return createMatcher("todo()", predicate, combinator);
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
 * Consume a section: a heading at the given depth, plus all body nodes
 * until the next heading of the same depth. The heading is included in the
 * returned chunk. Fails if the first remaining node is not a matching heading.
 */
export function section(depth: number): Combinator<BlockNode[]> {
  return (nodes) => {
    if (nodes.length === 0) return null;
    const first = nodes[0];
    if (first.type !== "heading" || first.depth !== depth) return null;

    let endIdx = nodes.length;
    for (let i = 1; i < nodes.length; i++) {
      if (nodes[i].type === "heading" && nodes[i].depth === depth) {
        endIdx = i;
        break;
      }
    }

    return {
      value: nodes.slice(0, endIdx),
      remaining: nodes.slice(endIdx),
    };
  };
}

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

// ============================================================================
// Predicate helpers
// ============================================================================

/**
 * Invert a node predicate. Matches nodes that the original predicate
 * does NOT match.
 */
export function except(predicate: NodePredicate): NodePredicate {
  return (node) => !predicate(node);
}

/**
 * Combine multiple predicates with OR. Matches if ANY predicate matches.
 */
export function any(...predicates: NodePredicate[]): NodePredicate {
  return (node) => predicates.some((p) => p(node));
}

/**
 * Combine multiple predicates with AND. Matches if ALL predicates match.
 */
export function all(...predicates: NodePredicate[]): NodePredicate {
  return (node) => predicates.every((p) => p(node));
}
