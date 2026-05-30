/**
 * Yieldable protocol implementation.
 *
 * Creates values that implement [Symbol.iterator] so they work with `yield*`
 * inside generator functions. The runner intercepts the yielded value,
 * executes the associated logic, and injects the result back.
 */

import type {
  BlockNode,
  Document,
  HeadingNode,
  ParagraphNode,
  CodeNode,
} from "../tree";
import type {
  Yieldable,
  Combinator,
  CombinatorResult,
  NodePredicate,
  ParseContext,
  EmitContext,
} from "./types";
import { YieldableSymbol } from "./types";

// ============================================================================
// Metadata interface attached to Yieldables for docs/trace
// ============================================================================

export interface YieldableMeta {
  description?: string;
  examples?: string[];
}

// ============================================================================
// Yieldable Factory
// ============================================================================

/**
 * Create a Yieldable value for the parse phase.
 *
 * The returned object is iterable. When used with `yield*`, the generator
 * yields the yieldable to the runner, which calls `run()` with the current
 * parse context. The result is injected back into the generator and becomes
 * the value of the `yield*` expression.
 *
 * Fluent metadata methods `.description()` and `.examples()` can be chained
 * before `yield*` to document what this combinator represents.
 */
export function createYieldable<T>(
  tag: string,
  combinatorName: string,
  run: (ctx: ParseContext) => CombinatorResult<T> | null
): Yieldable<T> {
  const self: Yieldable<T> = {
    [YieldableSymbol]: true,
    _tag: tag,
  } as Yieldable<T>;

  const meta: YieldableMeta = {};

  (self as any)[Symbol.iterator] = function* () {
    const result: any = yield self;
    return result as T;
  };

  (self as any).run = run;
  (self as any)._combinatorName = combinatorName;
  (self as any)._meta = meta;

  (self as any).description = (text: string) => {
    meta.description = text;
    return self;
  };

  (self as any).examples = (examples: string[]) => {
    meta.examples = examples;
    return self;
  };

  return self;
}

/**
 * Create a Yieldable value for the emit phase.
 */
export function createEmitYieldable(
  tag: string,
  emit: (ctx: EmitContext) => void
): Yieldable<void> {
  const self: Yieldable<void> = {
    [YieldableSymbol]: true,
    _tag: tag,
  } as Yieldable<void>;

  (self as any)[Symbol.iterator] = function* () {
    const result: any = yield self;
    return result;
  };

  (self as any).emit = emit;

  return self;
}

/**
 * Extract the run function from a parse-phase Yieldable.
 */
export function getYieldableRun<T>(
  y: Yieldable<T>
): ((ctx: ParseContext) => CombinatorResult<T> | null) | undefined {
  return (y as any).run;
}

/**
 * Extract the emit function from an emit-phase Yieldable.
 */
export function getYieldableEmit(
  y: Yieldable<unknown>
): ((ctx: EmitContext) => void) | undefined {
  return (y as any).emit;
}

/**
 * Extract combinator name from a parse-phase Yieldable.
 */
export function getCombinatorName(y: Yieldable<unknown>): string | undefined {
  return (y as any)._combinatorName;
}

/**
 * Extract metadata from a Yieldable.
 */
export function getYieldableMeta(y: Yieldable<unknown>): YieldableMeta | undefined {
  return (y as any)._meta;
}
