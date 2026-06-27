/**
 * Core types for the datamark Format SDK.
 *
 * The Format SDK provides a generator-based API for parsing Markdown
 * documents into typed objects and serializing them back. It uses a custom
 * iterable protocol so combinators work with `yield*`.
 */

import type {
  BlockNode,
  Document,
  HeadingNode,
  ParagraphNode,
  CodeNode,
} from "../tree";
import type { SourceSpan } from "../position";
import type { StandardSchemaV1 } from "../validation";

// ============================================================================
// Yieldable Protocol
// ============================================================================

/** Symbol that identifies a Yieldable value. */
export const YieldableSymbol = Symbol.for("datamark.yieldable");

/**
 * A value that can be used with `yield*` inside a parse or emit generator.
 *
 * When a generator yields a Yieldable, the runner executes its logic and
 * injects the result back into the generator. This is how `yield*` appears
 * to "return" a parsed value.
 *
 * Fluent metadata methods:
 *   .description(text) — human-readable explanation
 *   .examples(texts) — example markdown snippets this combinator matches
 */
export interface Yieldable<T> {
  readonly [YieldableSymbol]: true;
  readonly _tag: string;
}

/** Test if a value is a Yieldable. */
export function isYieldable(value: unknown): value is Yieldable<unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    YieldableSymbol in value &&
    (value as any)[YieldableSymbol] === true
  );
}

// ============================================================================
// Combinators
// ============================================================================

/**
 * A combinator transforms an array of block nodes into a value and a
 * remaining slice. `null` means the combinator did not match.
 */
export interface CombinatorResult<T> {
  readonly value: T;
  readonly remaining: BlockNode[];
}

export type Combinator<T> = (
  nodes: BlockNode[]
) => CombinatorResult<T> | null;

/** A predicate for matching block nodes. */
export type NodePredicate = (node: BlockNode) => boolean;

// ============================================================================
// Parse Context
// ============================================================================

/**
 * Context passed to parse generators. Holds the document state and
 * provides methods for consuming content.
 */
export interface ParseContext {
  /** The parsed document (frontmatter already extracted). */
  readonly document: Document;

  /** Currently unconsumed block nodes. */
  readonly remaining: BlockNode[];

  /**
   * Get the frontmatter object. Always returns the same value;
   * frontmatter is not part of the cursor.
   */
  frontmatter(): Yieldable<Record<string, unknown> | null>;

  /**
   * Run a combinator against the remaining nodes and advance the cursor.
   *
   * Without a second argument: returns the combinator result directly.
   *
   * With a transform function: applies the function to the result and
   * returns the transformed value.
   *
   * With a generator function: creates sub-context(s) from the result and
   * runs the generator. For chunking combinators (BlockNode[][]), runs on
   * each chunk and collects into an array. For flat results, runs once.
   */
  consume<T, R = T>(
    combinator: Combinator<T> | NodePredicate,
    transform?:
      | ((value: T) => R)
      | ((doc: ParseContext) => Generator<Yieldable<unknown>, R, unknown>)
  ): Yieldable<R | T>;

  /**
   * Run a combinator against the remaining nodes without advancing the cursor.
   * Same signature and behavior as consume(), but the parent cursor does
   * not move.
   */
  peek<T, R = T>(
    combinator: Combinator<T> | NodePredicate,
    transform?:
      | ((value: T) => R)
      | ((doc: ParseContext) => Generator<Yieldable<unknown>, R, unknown>)
  ): Yieldable<R | T>;
}

// ============================================================================
// Emit Context
// ============================================================================

/**
 * Context passed to emit generators. Accumulates nodes and metadata
 * to be serialized into a Markdown string.
 */
export interface EmitContext {
  /** Emit frontmatter metadata. */
  emitFrontmatter(data: Record<string, unknown>): Yieldable<void>;

  /** Emit a raw block node directly. */
  emitNode(node: BlockNode): void;

  /** Return the accumulated document. */
  toDocument(): Document;
}

// ============================================================================
// Format
// ============================================================================

export interface FormatExample {
  /** Example markdown text */
  text: string;
  /** Expected parsed output (if provided, the example is tested) */
  data?: unknown;
}

/**
 * Configuration for a datamark format.
 */
export interface FormatConfig<T> {
  /** Optional Standard Schema validator for the parsed result. */
  schema?: StandardSchemaV1<any, T>;

  /** Optional human-readable description of this format. */
  description?: string;

  /** Optional examples for documentation and testing. */
  examples?: Array<string | FormatExample>;

  /**
   * Parse generator. Receives a ParseContext and uses `yield*` with
   * combinators to consume the document. The generator's return value
   * becomes the parsed result.
   */
  parse: (doc: ParseContext) => Generator<Yieldable<unknown>, T, unknown>;

  /**
   * Optional stringify generator. Receives an EmitContext and the data
   * object, then emits nodes to build the output document.
   */
  stringify?: (
    doc: EmitContext,
    data: T
  ) => Generator<Yieldable<unknown>, void, unknown>;
}

/**
 * A compiled format that can parse Markdown strings into typed objects
 * and serialize them back.
 */
export interface Format<T> {
  /** Parse a Markdown string. Validates against schema if configured. */
  parse(content: string): T;

  /** Serialize a typed object back to Markdown. */
  stringify(data: T): string;

  /**
   * Trace how a specific document is parsed.
   * Returns a structured log of every combinator call and what it consumed.
   */
  trace(content: string): ParseTrace<T>;

  /**
   * Generate static documentation for this format.
   * Returns metadata, combinator descriptions, and schema info.
   */
  docs(): FormatDocs;

  /**
   * Test all configured examples against the parse generator + schema.
   */
  test(): TestResult;
}

// ============================================================================
// Parse Trace
// ============================================================================

export interface TraceStep {
  /** What kind of step this is */
  type: "consumeFrontmatter" | "consume" | "error";
  /** Human-readable combinator name, e.g. "heading(1)" */
  combinator?: string;
  /** User-provided description from .description() */
  description?: string;
  /** User-provided examples from .examples() */
  examples?: string[];
  /** The value produced by this combinator */
  matched: unknown;
  /** Block nodes consumed by this step */
  consumed: BlockNode[];
  /** Source region in the original markdown */
  region: SourceSpan;
}

export interface ParseTrace<T> {
  /** Full parsed document with positions */
  document: Document;
  /** Step-by-step trace of what was consumed */
  steps: TraceStep[];
  /** Final parsed result */
  result: T;
}

// ============================================================================
// Format Documentation
// ============================================================================

export interface DocsStep {
  combinator: string;
  description?: string;
  examples?: string[];
}

export interface FormatDocs {
  /** Optional top-level format description */
  description?: string;
  /** Configured examples */
  examples?: Array<string | FormatExample>;
  /** Sequence of combinator descriptions from the parse generator */
  steps: DocsStep[];
  /** JSON schema if configured */
  schema?: unknown;
}

// ============================================================================
// Test Result
// ============================================================================

export interface TestFailure {
  exampleIndex: number;
  example: string | FormatExample;
  error: string;
}

export interface TestResult {
  passed: boolean;
  failures: TestFailure[];
}

// ============================================================================
// Errors
// ============================================================================

export class TemplateParseError extends Error {
  constructor(
    message: string,
    public readonly cause?: unknown
  ) {
    super(message);
    this.name = "TemplateParseError";
  }
}
