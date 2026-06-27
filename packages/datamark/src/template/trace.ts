/**
 * Trace runner — record every combinator call during parsing.
 *
 * Produces a structured trace showing what was consumed at each step,
 * with source positions in the original markdown.
 */

import type { BlockNode, Document } from "../tree";
import { parse as parseDocument } from "../document";
import type {
  ParseContext,
  Yieldable,
  Combinator,
  ParseTrace,
  TraceStep,
} from "./types";
import { TemplateParseError } from "./types";
import {
  createYieldable,
  getYieldableRun,
  getCombinatorName,
  getYieldableMeta,
} from "./yieldable";
import type { NodeMatcher } from "./parse";
import { makeConsumeYieldable } from "./parse";

/**
 * Create a tracer from a generator function.
 *
 * The tracer runs the same parse logic as the normal parser, but records
 * every combinator call with its metadata, consumed nodes, and source region.
 */
export function trace<T>(
  fn: (doc: ParseContext) => Generator<Yieldable<unknown>, T, unknown>
): (content: string) => ParseTrace<T> {
  return (content: string) => {
    const document = parseDocument(content);
    let remaining = document.children;
    const steps: TraceStep[] = [];

    function regionFromNodes(nodes: BlockNode[]): TraceStep["region"] {
      if (nodes.length === 0) {
        return {
          start: { line: 1, column: 1, offset: 0 },
          end: { line: 1, column: 1, offset: 0 },
        };
      }
      const first = nodes[0]!;
      const last = nodes[nodes.length - 1]!;
      return {
        start: first.position?.start ?? { line: 1, column: 1, offset: 0 },
        end: last.position?.end ?? { line: 1, column: 1, offset: 0 },
      };
    }

    function recordStep(
      type: TraceStep["type"],
      combinator: string | undefined,
      description: string | undefined,
      examples: string[] | undefined,
      matched: unknown,
      consumed: BlockNode[],
      region: TraceStep["region"]
    ) {
      steps.push({
        type,
        combinator,
        description,
        examples,
        matched,
        consumed,
        region,
      });
    }

    function wrapYieldable<T>(
      y: Yieldable<T>,
      type: TraceStep["type"],
      before: BlockNode[]
    ): Yieldable<T> {
      const coreRun = getYieldableRun(y)!;
      (y as any).run = (ctx: ParseContext) => {
        const result = coreRun(ctx);
        if (result) {
          const consumed = before.slice(
            0,
            before.length - result.remaining.length
          );
          const meta = getYieldableMeta(y);
          recordStep(
            type,
            getCombinatorName(y),
            meta?.description,
            meta?.examples,
            result.value,
            consumed,
            regionFromNodes(consumed)
          );
        }
        return result;
      };
      return y;
    }

    const ctx: ParseContext = {
      document,
      get remaining() {
        return remaining;
      },

      frontmatter() {
        const y = createYieldable("frontmatter", "frontmatter", () => {
          return { value: document.frontmatter, remaining };
        });
        const coreRun = getYieldableRun(y)!;
        (y as any).run = (ctx: ParseContext) => {
          const result = coreRun(ctx);
          if (result) {
            const meta = getYieldableMeta(y);
            recordStep(
              "frontmatter",
              "frontmatter",
              meta?.description,
              meta?.examples,
              result.value,
              [],
              {
                start: { line: 1, column: 1, offset: 0 },
                end: { line: 1, column: 1, offset: 0 },
              }
            );
          }
          return result;
        };
        return y;
      },

      consume<T, R = T>(
        matcher: Combinator<T> | NodeMatcher<T>,
        transform?:
          | ((value: T) => R)
          | ((doc: ParseContext) => Generator<Yieldable<unknown>, R, unknown>)
      ): Yieldable<R | T> {
        const before = remaining;
        const y = makeConsumeYieldable(
          matcher,
          transform,
          remaining,
          "root",
          (newRemaining) => {
            remaining = newRemaining;
          },
          false
        );
        return wrapYieldable(y, "consume", before);
      },

      peek<T, R = T>(
        matcher: Combinator<T> | NodeMatcher<T>,
        transform?:
          | ((value: T) => R)
          | ((doc: ParseContext) => Generator<Yieldable<unknown>, R, unknown>)
      ): Yieldable<R | T> {
        const before = remaining;
        const y = makeConsumeYieldable(
          matcher,
          transform,
          remaining,
          "root",
          () => {
            // peek doesn't advance parent cursor
          },
          true
        );
        return wrapYieldable(y, "peek", before);
      },
    };

    const gen = fn(ctx);
    let step = gen.next();

    while (!step.done) {
      const yieldable = step.value;
      const run = getYieldableRun(yieldable);
      if (!run) {
        throw new TemplateParseError(
          `Unknown yieldable in trace generator: ${yieldable._tag}`
        );
      }
      const result = run(ctx);
      if (result === null) {
        throw new TemplateParseError(
          `Parse combinator "${yieldable._tag}" failed during trace`
        );
      }
      remaining = result.remaining;
      step = gen.next(result.value);
    }

    return {
      document,
      steps,
      result: step.value,
    };
  };
}
