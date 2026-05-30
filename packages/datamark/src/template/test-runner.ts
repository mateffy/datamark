/**
 * Test runner — validate configured examples against parse + schema.
 *
 * String examples are checked for parseability.
 * Object examples (with expected data) are checked for exact match.
 */

import type {
  FormatConfig,
  FormatExample,
  TestResult,
  TestFailure,
} from "./types";
import { parse as parseRunner } from "./parse";
import { validateData } from "../validation";

/**
 * Create a test runner for a format configuration.
 */
export function createTestRunner<T>(
  config: FormatConfig<T>
): () => TestResult {
  return () => {
    const failures: TestFailure[] = [];
    const examples = config.examples ?? [];

    for (let i = 0; i < examples.length; i++) {
      const example = examples[i]!;
      const result = runExample(config, example, i);
      if (result) failures.push(result);
    }

    return {
      passed: failures.length === 0,
      failures,
    };
  };
}

function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (typeof a !== "object" || typeof b !== "object") return false;
  if (a === null || b === null) return false;
  if (Array.isArray(a) !== Array.isArray(b)) return false;

  if (Array.isArray(a)) {
    if ((a as any[]).length !== (b as any[]).length) return false;
    for (let i = 0; i < (a as any[]).length; i++) {
      if (!deepEqual((a as any[])[i], (b as any[])[i])) return false;
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

function runExample<T>(
  config: FormatConfig<T>,
  example: string | FormatExample,
  index: number
): TestFailure | null {
  let text: string;
  let expectedData: unknown | undefined;

  if (typeof example === "string") {
    text = example;
  } else {
    text = example.text;
    expectedData = example.data;
  }

  try {
    const parser = parseRunner(config.parse);
    const result = parser(text);

    // Validate against schema if present
    if (config.schema) {
      try {
        validateData(config.schema, result);
      } catch (err: any) {
        return {
          exampleIndex: index,
          example,
          error: `Schema validation failed: ${err.message}`,
        };
      }
    }

    // If expected data is provided, check exact match
    if (expectedData !== undefined) {
      if (!deepEqual(result, expectedData)) {
        return {
          exampleIndex: index,
          example,
          error: `Output mismatch.\nExpected:\n${JSON.stringify(expectedData, null, 2)}\n\nActual:\n${JSON.stringify(result, null, 2)}`,
        };
      }
    }

    return null; // passed
  } catch (err: any) {
    return {
      exampleIndex: index,
      example,
      error: `Parse error: ${err.message ?? String(err)}`,
    };
  }
}
