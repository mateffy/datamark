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
import { getCombinator } from "./parse";

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
    let frontmatterConsumed = false;
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

    const ctx: ParseContext = {
      document,
      get remaining() {
        return remaining;
      },

      consumeFrontmatter() {
        const y = createYieldable(
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
        // Wrap the run function to record the step
        const originalRun = getYieldableRun(y)!;
        (y as any).run = (ctx: ParseContext) => {
          const result = originalRun(ctx);
          if (result) {
            const meta = getYieldableMeta(y);
            recordStep(
              "consumeFrontmatter",
              "consumeFrontmatter",
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

      consume<T>(matcher: NodeMatcher<T> | Combinator<T>): Yieldable<T> {
        const combinator = getCombinator(matcher) ?? (matcher as Combinator<T>);
        const name =
          typeof matcher === "function" && "_combinatorName" in matcher
            ? (matcher as any)._combinatorName ?? "consume"
            : "consume";

        const y = createYieldable("consume", name, () => {
          const result = combinator(remaining);
          if (result === null) {
            throw new TemplateParseError(
              `Parse combinator failed during trace`
            );
          }
          remaining = result.remaining;
          return result;
        });

        // Wrap the run function to record the step
        const originalRun = getYieldableRun(y)!;
        (y as any).run = (ctx: ParseContext) => {
          const before = remaining;
          const result = originalRun(ctx);
          if (result) {
            const consumed = before.slice(0, before.length - result.remaining.length);
            const meta = getYieldableMeta(y);
            recordStep(
              "consume",
              name,
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
