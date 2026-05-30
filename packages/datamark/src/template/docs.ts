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
import { getCombinator } from "./parse";

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

      consumeFrontmatter() {
        const y = createYieldable(
          "consumeFrontmatter",
          "consumeFrontmatter",
          () => ({ value: syntheticFrontmatter(), remaining })
        );
        (y as any).run = () => {
          recordDocs(y, "consumeFrontmatter");
          return { value: syntheticFrontmatter(), remaining };
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
          // Try the combinator first on current remaining
          const result = combinator(remaining);
          if (result !== null) {
            remaining = result.remaining;
            return result;
          }
          // Fall back to synthetic value
          const synth = syntheticValue(name) as T;
          return { value: synth, remaining };
        });

        const originalRun = getYieldableRun(y)!;
        (y as any).run = () => {
          recordDocs(y, name);
          return originalRun(ctx);
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
