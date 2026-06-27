/**
 * Docs runner — generate static documentation for a format.
 *
 * Runs the parse generator against a synthetic document where every
 * combinator succeeds with a dummy value. Records the metadata
 * attached to each combinator call.
 */

import type { BlockNode, HeadingNode, ParagraphNode, CodeNode } from "../tree";
import type {
  ParseContext,
  Yieldable,
  Combinator,
  CombinatorResult,
  FormatDocs,
  DocsStep,
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

// ============================================================================
// Synthetic values for docs
// ============================================================================

function syntheticFrontmatter(): Record<string, unknown> {
  return { id: "example-id", title: "Example Title" };
}

function syntheticHeading(depth: number): HeadingNode {
  return {
    type: "heading",
    depth,
    children: [{ type: "text", value: "Example Heading", raw: "Example Heading" }],
    raw: "#".repeat(depth) + " Example Heading",
  };
}

function syntheticParagraph(): ParagraphNode {
  return {
    type: "paragraph",
    children: [{ type: "text", value: "Example paragraph text.", raw: "Example paragraph text." }],
    raw: "Example paragraph text.",
  };
}

function syntheticCodeBlock(lang?: string): CodeNode {
  return {
    type: "code",
    lang,
    meta: undefined,
    value: "// example code",
    raw: "```" + (lang ?? "") + "\n// example code\n```",
  };
}

// ============================================================================
// Docs runner
// ============================================================================

/**
 * Create a docs generator from a parse generator.
 *
 * The generator is run against a synthetic ParseContext where every
 * combinator succeeds with a placeholder value. Metadata attached
 * via .description() and .examples() is recorded into a FormatDocs.
 */
export function docs<T>(
  fn: (doc: ParseContext) => Generator<Yieldable<unknown>, T, unknown>
): () => FormatDocs {
  return () => {
    let remaining: BlockNode[] = [];
    const steps: DocsStep[] = [];

    function recordDocs(y: Yieldable<unknown>, combinatorName: string) {
      const meta = getYieldableMeta(y);
      steps.push({
        combinator: combinatorName,
        description: meta?.description,
        examples: meta?.examples,
      });
    }

    function wrapYieldable<T>(y: Yieldable<T>): Yieldable<T> {
      const coreRun = getYieldableRun(y)!;
      (y as any).run = (ctx: ParseContext) => {
        try {
          const result = coreRun(ctx);
          recordDocs(y, getCombinatorName(y) ?? "consume");
          return result;
        } catch {
          // Combinator failed — provide synthetic value
          const name = getCombinatorName(y) ?? "consume";
          const synth = syntheticValue(name);
          recordDocs(y, name);
          return { value: synth as T, remaining };
        }
      };
      return y;
    }

    const ctx: ParseContext = {
      document: {
        type: "document",
        frontmatter: syntheticFrontmatter(),
        title: "Example Title",
        children: [],
      },
      get remaining() {
        return remaining;
      },

      frontmatter() {
        const y = createYieldable(
          "frontmatter",
          "frontmatter",
          () => ({ value: syntheticFrontmatter(), remaining })
        );
        const coreRun = getYieldableRun(y)!;
        (y as any).run = () => {
          const result = coreRun(ctx);
          recordDocs(y, "frontmatter");
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
        const y = makeConsumeYieldable(
          matcher,
          transform,
          remaining,
          "docs",
          (newRemaining) => {
            remaining = newRemaining;
          },
          false
        );
        return wrapYieldable(y);
      },

      peek<T, R = T>(
        matcher: Combinator<T> | NodeMatcher<T>,
        transform?:
          | ((value: T) => R)
          | ((doc: ParseContext) => Generator<Yieldable<unknown>, R, unknown>)
      ): Yieldable<R | T> {
        const y = makeConsumeYieldable(
          matcher,
          transform,
          remaining,
          "docs",
          () => {
            // peek doesn't advance parent cursor
          },
          true
        );
        return wrapYieldable(y);
      },
    };

    const gen = fn(ctx);
    let step = gen.next();

    while (!step.done) {
      const yieldable = step.value;
      const run = getYieldableRun(yieldable);
      if (!run) {
        throw new TemplateParseError(
          `Unknown yieldable in docs generator: ${yieldable._tag}`
        );
      }
      const result = run(ctx);
      if (result === null) {
        throw new TemplateParseError(
          `Docs combinator "${yieldable._tag}" failed — this should not happen in docs mode`
        );
      }
      remaining = result.remaining;
      step = gen.next(result.value);
    }

    return { steps };
  };
}

function syntheticValue(combinatorName: string): unknown {
  if (combinatorName.startsWith("heading(")) {
    const depth = parseInt(combinatorName.match(/\d+/)?.[0] ?? "1", 10);
    return syntheticHeading(depth);
  }
  if (combinatorName === "paragraph()") return syntheticParagraph();
  if (combinatorName.startsWith("codeBlock(")) {
    const match = combinatorName.match(/lang:\s*"([^"]+)"/);
    return syntheticCodeBlock(match?.[1]);
  }
  if (combinatorName.startsWith("splitBy(")) return [];
  if (combinatorName === "until(...)") return [];
  if (combinatorName === "rest()") return [];
  return undefined;
}
