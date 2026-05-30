/**
 * Datamark Template System
 *
 * A generator-based API for parsing Markdown documents into typed objects
 * and serializing them back. Built on top of the core datamark AST and
 * utilities.
 *
 * @example
 * ```typescript
 * import { datamark, heading, codeBlock, splitBy, markdown, todoItem } from "datamark/template";
 * import * as z from "zod";
 *
 * const PlanFormat = datamark({
 *   schema: z.object({
 *     id: z.string(),
 *     title: z.string(),
 *     steps: z.array(z.object({
 *       description: z.string(),
 *       scripts: z.array(z.string()),
 *       tasks: z.array(z.object({ text: z.string(), completed: z.boolean() })),
 *     })),
 *   }),
 *
 *   *parse(doc) {
 *     const fm = yield* doc.consumeFrontmatter();
 *     const titleNode = yield* doc.consume(heading(1));
 *     const sections = yield* doc.consume(splitBy(heading(2)));
 *
 *     const steps = sections.map((section) => {
 *       const scripts = section
 *         .filter((n) => n.type === "code")
 *         .map((n: any) => n.value);
 *       const tasks = []; // extract todo items...
 *       const other = section.filter((n) => n.type !== "code" && n.type !== "list");
 *       const description = other.map((n: any) => ("value" in n ? n.value : "")).join("\n").trim();
 *       return { description, scripts, tasks };
 *     });
 *
 *     return { id: (fm as any)?.id ?? "", title: titleNode.text, steps };
 *   },
 *
 *   *stringify(doc, data) {
 *     yield* doc.emitFrontmatter({ id: data.id, title: data.title });
 *     yield* heading(1, data.title);
 *     for (const step of data.steps) {
 *       yield* heading(2, "Step");
 *       if (step.description) yield* markdown(step.description);
 *       for (const s of step.scripts) yield* codeBlock("javascript", s);
 *       for (const t of step.tasks) yield* todoItem(t.text, t.completed);
 *     }
 *   },
 * });
 * ```
 */

export type {
  Format,
  FormatConfig,
  ParseContext,
  EmitContext,
  Combinator,
  CombinatorResult,
  NodePredicate,
  NodeMatcher,
  TemplateParseError,
  Yieldable,
  ParseTrace,
  TraceStep,
  FormatDocs,
  DocsStep,
  FormatExample,
  TestResult,
  TestFailure,
} from "./types";

export {
  isYieldable,
  YieldableSymbol,
} from "./types";

export type { YieldableMeta } from "./yieldable";

export {
  createYieldable,
  createEmitYieldable,
  getYieldableRun,
  getYieldableEmit,
  getCombinatorName,
  getYieldableMeta,
} from "./yieldable";

export {
  parse,
  optional,
  many,
  repeat,
  until,
  splitBy,
  rest,
  getCombinator,
} from "./parse";

export {
  emit,
  hr,
  markdown,
  todoItem,
} from "./emit";

export { trace } from "./trace";
export { docs } from "./docs";
export { createTestRunner } from "./test-runner";

// Re-export emit combinators with different names to avoid conflicts
export {
  heading as emitHeading,
  paragraph as emitParagraph,
  codeBlock as emitCodeBlock,
} from "./emit";

// Combined overloads for use in both parse and emit contexts
import { heading as parseHeading, paragraph as parseParagraph, codeBlock as parseCodeBlock } from "./parse";
import { heading as emitHeadingFn, paragraph as emitParagraphFn, codeBlock as emitCodeBlockFn } from "./emit";
import type { NodeMatcher } from "./types";
import type { HeadingNode, ParagraphNode, CodeNode } from "../tree";
import type { Yieldable } from "./types";

/** Match a heading (parse) or emit a heading (emit). */
export function heading(depth: number): NodeMatcher<HeadingNode>;
export function heading(depth: number, text: string): Yieldable<void>;
export function heading(depth: number, text?: string): any {
  return text !== undefined ? emitHeadingFn(depth, text) : parseHeading(depth);
}

/** Match a paragraph (parse) or emit a paragraph (emit). */
export function paragraph(): NodeMatcher<ParagraphNode>;
export function paragraph(text: string): Yieldable<void>;
export function paragraph(text?: string): any {
  return text !== undefined ? emitParagraphFn(text) : parseParagraph();
}

/** Match a code block (parse) or emit a code block (emit). */
export function codeBlock(options?: { lang?: string }): NodeMatcher<CodeNode>;
export function codeBlock(lang: string, code: string): Yieldable<void>;
export function codeBlock(langOrOptions?: string | { lang?: string }, code?: string): any {
  if (typeof langOrOptions === "string") {
    return emitCodeBlockFn(langOrOptions, code ?? "");
  }
  return parseCodeBlock(langOrOptions);
}

import type { FormatConfig, Format } from "./types";
import { parse as parseRunner } from "./parse";
import { emit as emitRunner } from "./emit";
import { trace as traceRunner } from "./trace";
import { docs as docsRunner } from "./docs";
import { createTestRunner } from "./test-runner";
import { validateData } from "../validation";

/**
 * Create a reusable format that parses Markdown into typed objects
 * and serializes them back.
 *
 * Accepts raw generator functions for `parse` and optional `stringify`.
 * These are wrapped internally into runnable parsers/stringifiers.
 *
 * When a schema is provided, parsed results are validated automatically.
 *
 * The returned format also supports:
 *   - `.trace(markdown)` — trace how a document is consumed step-by-step
 *   - `.docs()` — generate static documentation from combinator metadata
 *   - `.test()` — validate configured examples against parse + schema
 */
export function datamark<T>(config: FormatConfig<T>): Format<T> {
  const parser = parseRunner(config.parse);
  const stringifier = config.stringify
    ? emitRunner(config.stringify)
    : undefined;
  const tracer = traceRunner(config.parse);
  const docsGen = docsRunner(config.parse);
  const testRunner = createTestRunner(config);

  return {
    parse(content: string): T {
      const result = parser(content);
      if (config.schema) {
        return validateData(config.schema, result);
      }
      return result as T;
    },

    stringify(data: T): string {
      if (!stringifier) {
        throw new Error(
          "This format does not have a stringify template. " +
            "Provide `stringify` to enable serialization."
        );
      }
      return stringifier(data);
    },

    trace(content: string) {
      return tracer(content);
    },

    docs() {
      const result = docsGen();
      return {
        description: config.description,
        examples: config.examples,
        steps: result.steps,
        schema: config.schema
          ? // Try to extract JSON schema from Standard Schema
            (config.schema as any)["~standard"]?.types?.output ?? undefined
          : undefined,
      };
    },

    test() {
      return testRunner();
    },
  };
}
