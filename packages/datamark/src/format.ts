import type { StandardSchemaV1 } from "./validation";
import { validateData } from "./validation";
import { parse } from "./document";
import type { Document } from "./tree";

// ============================================================================
// Types
// ============================================================================

export interface FormatExample {
  /** Example markdown text */
  text: string;
  /** Expected parsed output (if provided, the example is tested) */
  data?: unknown;
}

export interface FormatDocs {
  description?: string;
  examples?: Array<string | FormatExample>;
  structure?: unknown;
  schema?: unknown;
}

/**
 * Document with typed frontmatter.
 *
 * When `frontmatterSchema` is provided, frontmatter is validated before
 * your `parse` function runs. If validation passes, `doc.frontmatter` is
 * typed as `F` — the schema's output type. If the document lacks frontmatter
 * and your schema rejects `null`, `parse()` throws `ValidationError` before
 * your function is ever called.
 *
 * If you need frontmatter to be optional, use an optional schema such as
 * `z.object({ ... }).optional()` — then `F` will be the union type the
 * schema infers.
 */
export type DocumentWithFrontmatter<F> = Omit<Document, "frontmatter"> & {
  frontmatter: F;
};

export interface FormatConfig<
  T = unknown,
  F = Record<string, unknown>
> {
  /** Optional Standard Schema validator for frontmatter. */
  frontmatterSchema?: StandardSchemaV1<any, F>;

  /** Optional Standard Schema validator for the parsed result. */
  schema?: StandardSchemaV1<any, T>;

  /** Optional human-readable description of this format. */
  description?: string;

  /** Optional examples for documentation and testing. */
  examples?: Array<string | FormatExample>;

  /** Optional docs metadata for the format. */
  docs?: FormatDocs;

  /**
   * Parse function: receives a Document with typed frontmatter and returns
   * typed data.
   */
  parse: (doc: DocumentWithFrontmatter<F>) => T;

  /** Optional stringify function: receives typed data and returns a markdown string. */
  stringify?: (data: T) => string;
}

export interface TestResult {
  passed: boolean;
  failures: Array<{ exampleIndex: number; example: unknown; error: string }>;
}

export interface Format<T> {
  /** Parse a Markdown string. Validates frontmatter + schema if configured. */
  parse(content: string): T;

  /** Serialize a typed object back to Markdown. */
  stringify(data: T): string;

  /** Test all configured examples against parse + frontmatter schema + schema. */
  test(): TestResult;

  /** Generate static documentation for this format. */
  docs(): FormatDocs;
}

// ============================================================================
// Test runner
// ============================================================================

function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (typeof a !== "object" || typeof b !== "object") return false;
  if (a === null || b === null) return false;
  if (Array.isArray(a) !== Array.isArray(b)) return false;

  if (Array.isArray(a)) {
    if (a.length !== (b as any[]).length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], (b as any[])[i])) return false;
    }
    return true;
  }

  const aKeys = Object.keys(a as object).sort();
  const bKeys = Object.keys(b as object).sort();
  if (aKeys.length !== bKeys.length) return false;
  for (let i = 0; i < aKeys.length; i++) {
    const key = aKeys[i]!;
    if (key !== bKeys[i]) return false;
    if (!deepEqual((a as any)[key], (b as any)[key])) return false;
  }
  return true;
}

function createTestRunner<T, F>(
  config: FormatConfig<T, F>
): () => TestResult {
  return () => {
    const failures: TestResult["failures"] = [];
    const examples = config.examples ?? [];

    for (let i = 0; i < examples.length; i++) {
      const example = examples[i]!;
      const text = typeof example === "string" ? example : example.text;
      try {
        const doc = parse(text);
        if (config.frontmatterSchema) {
          validateData(config.frontmatterSchema, doc.frontmatter);
        }
        const result = config.parse(doc as DocumentWithFrontmatter<F>);
        if (config.schema) {
          validateData(config.schema, result);
        }
        if (typeof example === "object" && example.data !== undefined) {
          if (!deepEqual(result, example.data)) {
            failures.push({
              exampleIndex: i,
              example,
              error: `Output mismatch: expected ${JSON.stringify(example.data)}, got ${JSON.stringify(result)}`,
            });
          }
        }
      } catch (err: any) {
        failures.push({
          exampleIndex: i,
          example,
          error: err.message ?? String(err),
        });
      }
    }

    return { passed: failures.length === 0, failures };
  };
}

// ============================================================================
// datamark()
// ============================================================================

/**
 * Create a reusable format that parses Markdown strings into typed objects
 * and optionally serializes them back.
 *
 * When `frontmatterSchema` is provided, `doc.frontmatter` in the `parse`
 * function is typed as the schema's output type. When `schema` is provided,
 * `parse()` validates the output automatically and the returned `Format`
 * is typed accordingly.
 *
 * @example
 * ```typescript
 * const FrontmatterSchema = z.object({ id: z.string() });
 * const OutputSchema = z.object({ id: z.string(), title: z.string() });
 *
 * const MyFormat = datamark({
 *   frontmatterSchema: FrontmatterSchema,
 *   schema: OutputSchema,
 *   parse(doc) {
 *     // doc.frontmatter is typed as { id: string }
 *     return {
 *       id: doc.frontmatter.id,
 *       title: "...",
 *     };
 *   },
 * });
 *
 * const result = MyFormat.parse(markdown);
 * // result is typed as { id: string; title: string }
 * ```
 */
export function datamark<T = unknown, F = Record<string, unknown>>(
  config: FormatConfig<T, F>
): Format<T> {
  const testRunner = createTestRunner(config);

  return {
    parse(content: string): T {
      const doc = parse(content);
      if (config.frontmatterSchema) {
        validateData(config.frontmatterSchema, doc.frontmatter);
      }
      const result = config.parse(doc as DocumentWithFrontmatter<F>);
      if (config.schema) {
        return validateData(config.schema, result);
      }
      return result as T;
    },

    stringify(data: T): string {
      if (!config.stringify) {
        throw new Error(
          "This format does not have a stringify function. " +
            "Provide `stringify` to enable serialization."
        );
      }
      return config.stringify(data);
    },

    test() {
      return testRunner();
    },

    docs() {
      return {
        description: config.description,
        examples: config.examples,
        structure: config.docs?.structure,
        schema: config.schema
          ? (config.schema as any)["~standard"]?.types?.output ?? undefined
          : undefined,
      };
    },
  };
}
