import { describe, test, expect } from "bun:test";
import { createTestRunner } from "./test-runner";
import { heading, paragraph, many } from "./parse";
import type { FormatConfig } from "./types";

function mockSchema(validator: (v: unknown) => boolean): any {
  return {
    "~standard": {
      version: 1,
      vendor: "mock",
      validate(value: unknown) {
        if (validator(value)) return { value };
        return { issues: [{ message: "validation failed" }] };
      },
    },
  };
}

describe("createTestRunner", () => {
  test("no examples → { passed: true, failures: [] }", () => {
    const config: FormatConfig<unknown> = {
      parse: function* () {
        return {};
      },
      examples: [],
    };
    const result = createTestRunner(config)();
    expect(result.passed).toBe(true);
    expect(result.failures).toHaveLength(0);
  });

  test("string example parses → passes", () => {
    const config: FormatConfig<unknown> = {
      parse: function* (doc) {
        yield* doc.consume(heading(1));
        return {};
      },
      examples: ["# Hello"],
    };
    const result = createTestRunner(config)();
    expect(result.passed).toBe(true);
    expect(result.failures).toHaveLength(0);
  });

  test("object example with matching data → passes", () => {
    const config: FormatConfig<unknown> = {
      parse: function* (doc) {
        const h = yield* doc.consume(heading(1));
        return { title: h.children[0]!.type === "text" ? h.children[0]!.value : "" };
      },
      examples: [{ text: "# Hello", data: { title: "Hello" } }],
    };
    const result = createTestRunner(config)();
    expect(result.passed).toBe(true);
    expect(result.failures).toHaveLength(0);
  });

  test("multiple examples all pass", () => {
    const config: FormatConfig<unknown> = {
      parse: function* (doc) {
        yield* doc.consume(heading(1));
        return { ok: true };
      },
      examples: [
        { text: "# A", data: { ok: true } },
        { text: "# B", data: { ok: true } },
      ],
    };
    const result = createTestRunner(config)();
    expect(result.passed).toBe(true);
    expect(result.failures).toHaveLength(0);
  });

  test("schema validation passes", () => {
    const config: FormatConfig<unknown> = {
      parse: function* () {
        return { name: "test" };
      },
      schema: mockSchema((v) => typeof v === "object" && v !== null && (v as any).name === "test"),
      examples: [{ text: "any", data: { name: "test" } }],
    };
    const result = createTestRunner(config)();
    expect(result.passed).toBe(true);
    expect(result.failures).toHaveLength(0);
  });

  test("parse error → failure with message", () => {
    const config: FormatConfig<unknown> = {
      parse: function* (doc) {
        yield* doc.consume(heading(2));
        return {};
      },
      examples: ["# Hello"],
    };
    const result = createTestRunner(config)();
    expect(result.passed).toBe(false);
    expect(result.failures[0]!.error).toContain("Parse error");
  });

  test("schema validation failure → failure with schema error", () => {
    const config: FormatConfig<unknown> = {
      parse: function* () {
        return { name: "test" };
      },
      schema: mockSchema((v) => (v as any)?.name === "wrong"),
      examples: [{ text: "any", data: { name: "test" } }],
    };
    const result = createTestRunner(config)();
    expect(result.passed).toBe(false);
    expect(result.failures[0]!.error).toContain("Schema validation failed");
  });

  test("output mismatch → failure with diff", () => {
    const config: FormatConfig<unknown> = {
      parse: function* () {
        return { name: "actual" };
      },
      examples: [{ text: "any", data: { name: "expected" } }],
    };
    const result = createTestRunner(config)();
    expect(result.passed).toBe(false);
    expect(result.failures[0]!.error).toContain("Output mismatch");
  });

  test("one failure among multiple examples", () => {
    const config: FormatConfig<unknown> = {
      parse: function* () {
        return { n: 1 };
      },
      examples: [
        { text: "a", data: { n: 1 } },
        { text: "b", data: { n: 2 } },
      ],
    };
    const result = createTestRunner(config)();
    expect(result.passed).toBe(false);
    expect(result.failures).toHaveLength(1);
    expect(result.failures[0]!.exampleIndex).toBe(1);
  });

  test("mixed string and object examples", () => {
    const config: FormatConfig<unknown> = {
      parse: function* () {
        return { ok: true };
      },
      examples: ["# Hello", { text: "# Hello", data: { ok: true } }],
    };
    const result = createTestRunner(config)();
    expect(result.passed).toBe(true);
    expect(result.failures).toHaveLength(0);
  });

  test("deepEqual: primitives equal", () => {
    const config: FormatConfig<unknown> = {
      parse: function* () {
        return 42;
      },
      examples: [{ text: "any", data: 42 }],
    };
    const result = createTestRunner(config)();
    expect(result.passed).toBe(true);
  });

  test("deepEqual: objects equal and different key order equal", () => {
    const config: FormatConfig<unknown> = {
      parse: function* () {
        return { a: 1, b: 2 };
      },
      examples: [
        { text: "any", data: { a: 1, b: 2 } },
        { text: "any", data: { b: 2, a: 1 } },
      ],
    };
    const result = createTestRunner(config)();
    expect(result.passed).toBe(true);
    expect(result.failures).toHaveLength(0);
  });

  test("deepEqual: arrays equal", () => {
    const config: FormatConfig<unknown> = {
      parse: function* () {
        return [1, 2, 3];
      },
      examples: [{ text: "any", data: [1, 2, 3] }],
    };
    const result = createTestRunner(config)();
    expect(result.passed).toBe(true);
  });

  test("deepEqual: nested structures equal", () => {
    const config: FormatConfig<unknown> = {
      parse: function* () {
        return { a: { b: [1, 2] } };
      },
      examples: [{ text: "any", data: { a: { b: [1, 2] } } }],
    };
    const result = createTestRunner(config)();
    expect(result.passed).toBe(true);
  });

  test("deepEqual unhappy: different primitives and different types", () => {
    const config: FormatConfig<unknown> = {
      parse: function* () {
        return 42;
      },
      examples: [
        { text: "any", data: 99 },
        { text: "any", data: "42" },
      ],
    };
    const result = createTestRunner(config)();
    expect(result.passed).toBe(false);
    expect(result.failures).toHaveLength(2);
  });

  test("deepEqual unhappy: arrays different length", () => {
    const config: FormatConfig<unknown> = {
      parse: function* () {
        return [1, 2];
      },
      examples: [{ text: "any", data: [1, 2, 3] }],
    };
    const result = createTestRunner(config)();
    expect(result.passed).toBe(false);
    expect(result.failures[0]!.error).toContain("Output mismatch");
  });

  test("deepEqual unhappy: objects different keys", () => {
    const config: FormatConfig<unknown> = {
      parse: function* () {
        return { a: 1 };
      },
      examples: [{ text: "any", data: { a: 1, b: 2 } }],
    };
    const result = createTestRunner(config)();
    expect(result.passed).toBe(false);
    expect(result.failures[0]!.error).toContain("Output mismatch");
  });

  test("deepEqual unhappy: nested mismatch", () => {
    const config: FormatConfig<unknown> = {
      parse: function* () {
        return { a: { b: 1 } };
      },
      examples: [{ text: "any", data: { a: { b: 2 } } }],
    };
    const result = createTestRunner(config)();
    expect(result.passed).toBe(false);
    expect(result.failures[0]!.error).toContain("Output mismatch");
  });

  test("deepEqual edge: null vs object → false and null equals null", () => {
    const config1: FormatConfig<unknown> = {
      parse: function* () {
        return null;
      },
      examples: [{ text: "any", data: {} }],
    };
    const config2: FormatConfig<unknown> = {
      parse: function* () {
        return null;
      },
      examples: [{ text: "any", data: null }],
    };
    expect(createTestRunner(config1)().passed).toBe(false);
    expect(createTestRunner(config2)().passed).toBe(true);
  });

  test("example with frontmatter + body", () => {
    const config: FormatConfig<unknown> = {
      parse: function* (doc) {
        const fm = yield* doc.consumeFrontmatter();
        const h = yield* doc.consume(heading(1));
        return {
          id: (fm as any)?.id,
          title: h.children[0]!.type === "text" ? h.children[0]!.value : "",
        };
      },
      examples: [{ text: "---\nid: x\n---\n\n# Hello", data: { id: "x", title: "Hello" } }],
    };
    const result = createTestRunner(config)();
    expect(result.passed).toBe(true);
    expect(result.failures).toHaveLength(0);
  });

  test("example that produces array result", () => {
    const config: FormatConfig<unknown> = {
      parse: function* (doc) {
        const nodes = yield* doc.consume(many(paragraph()));
        return nodes.map((n: any) => (n.children[0]!.type === "text" ? n.children[0]!.value : ""));
      },
      examples: [{ text: "A\n\nB", data: ["A", "B"] }],
    };
    const result = createTestRunner(config)();
    expect(result.passed).toBe(true);
    expect(result.failures).toHaveLength(0);
  });

  test("example that produces nested object result", () => {
    const config: FormatConfig<unknown> = {
      parse: function* (doc) {
        const fm = yield* doc.consumeFrontmatter();
        const h = yield* doc.consume(heading(1));
        return {
          meta: { id: (fm as any)?.id },
          content: { title: h.children[0]!.type === "text" ? h.children[0]!.value : "" },
        };
      },
      examples: [
        {
          text: "---\nid: x\n---\n\n# Hello",
          data: { meta: { id: "x" }, content: { title: "Hello" } },
        },
      ],
    };
    const result = createTestRunner(config)();
    expect(result.passed).toBe(true);
    expect(result.failures).toHaveLength(0);
  });
});
