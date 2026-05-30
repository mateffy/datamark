import { describe, test, expect } from "bun:test";
import {
  datamark,
  heading,
  paragraph,
  codeBlock,
  many,
  optional,
  repeat,
  splitBy,
  YieldableSymbol,
  getCombinator,
} from "./index";
import type { HeadingNode } from "../tree";
import { ValidationError } from "../validation";

function mockSchema(
  validator: (data: unknown) => { value?: unknown; issues?: { message: string }[] }
) {
  return {
    "~standard": {
      version: 1 as const,
      vendor: "mock",
      validate: validator,
    },
  };
}

function headingText(h: HeadingNode): string {
  return h.children.map((c: any) => c.value ?? "").join("");
}

describe("datamark format", () => {
  test("datamark() creates object with parse, stringify, trace, docs, test methods", () => {
    const format = datamark({
      *parse(doc) {
        const h = yield* doc.consume(heading(1));
        return { title: headingText(h) };
      },
      *stringify(doc, data) {
        yield* heading(1, data.title);
      },
    });
    expect(typeof format.parse).toBe("function");
    expect(typeof format.stringify).toBe("function");
    expect(typeof format.trace).toBe("function");
    expect(typeof format.docs).toBe("function");
    expect(typeof format.test).toBe("function");
  });

  test("parse() returns typed result", () => {
    const format = datamark({
      *parse(doc) {
        const h = yield* doc.consume(heading(1));
        return { title: headingText(h) };
      },
    });
    const result = format.parse("# Hello\n\nBody");
    expect(result.title).toBe("Hello");
  });

  test("stringify() returns markdown string", () => {
    const format = datamark({
      *parse(doc) {
        const h = yield* doc.consume(heading(1));
        return { title: headingText(h) };
      },
      *stringify(doc, data) {
        yield* heading(1, data.title);
      },
    });
    const md = format.stringify({ title: "Hello" });
    expect(md).toContain("# Hello");
  });

  test("trace() returns ParseTrace", () => {
    const format = datamark({
      *parse(doc) {
        const h = yield* doc.consume(heading(1));
        return { title: headingText(h) };
      },
    });
    const trace = format.trace("# Hello");
    expect(trace.document).toBeDefined();
    expect(trace.steps).toBeDefined();
    expect(Array.isArray(trace.steps)).toBe(true);
    expect(trace.result).toBeDefined();
  });

  test("docs() returns FormatDocs with steps", () => {
    const format = datamark({
      *parse(doc) {
        const h = yield* doc.consume(heading(1));
        return { title: headingText(h) };
      },
    });
    const docs = format.docs();
    expect(docs.steps).toBeDefined();
    expect(Array.isArray(docs.steps)).toBe(true);
    expect(docs.steps.length).toBeGreaterThan(0);
  });

  test("test() returns TestResult", () => {
    const format = datamark({
      examples: ["# Hello"],
      *parse(doc) {
        const h = yield* doc.consume(heading(1));
        return { title: headingText(h) };
      },
    });
    const result = format.test();
    expect(typeof result.passed).toBe("boolean");
    expect(Array.isArray(result.failures)).toBe(true);
  });

  test("With schema: validates parsed result and types it", () => {
    const format = datamark({
      schema: mockSchema((data) => {
        if (data && typeof data === "object" && "title" in data) return { value: data };
        return { issues: [{ message: "Missing title" }] };
      }),
      *parse(doc) {
        const h = yield* doc.consume(heading(1));
        return { title: headingText(h) };
      },
    });
    const result = format.parse("# Hello");
    expect(result.title).toBe("Hello");
  });

  test("With description: docs includes it", () => {
    const format = datamark({
      description: "A simple format",
      *parse(doc) {
        return {};
      },
    });
    const docs = format.docs();
    expect(docs.description).toBe("A simple format");
  });

  test("With examples: docs and test use them", () => {
    const format = datamark({
      examples: ["# Example"],
      *parse(doc) {
        const h = yield* doc.consume(heading(1));
        return { title: headingText(h) };
      },
    });
    const docs = format.docs();
    expect(docs.examples).toBeDefined();
    expect(docs.examples!.length).toBe(1);
    const testResult = format.test();
    expect(testResult.passed).toBe(true);
  });

  test("stringify not configured throws Error with helpful message", () => {
    const format = datamark({
      *parse(doc) {
        return {};
      },
    });
    expect(() => format.stringify({} as any)).toThrow(
      "does not have a stringify template"
    );
  });

  test("Schema validation fails throws ValidationError", () => {
    const format = datamark({
      schema: mockSchema(() => ({ issues: [{ message: "Always fails" }] })),
      *parse(doc) {
        return { bad: true };
      },
    });
    expect(() => format.parse("# Anything")).toThrow(ValidationError);
  });

  test("Parse-only format (no stringify generator)", () => {
    const format = datamark({
      *parse(doc) {
        const h = yield* doc.consume(heading(1));
        return { title: headingText(h) };
      },
    });
    expect(typeof format.parse).toBe("function");
    expect(() => format.stringify({} as any)).toThrow();
  });

  test("No schema, no examples", () => {
    const format = datamark({
      *parse(doc) {
        return { ok: true };
      },
    });
    const result = format.parse("anything");
    expect(result).toEqual({ ok: true });
    const docs = format.docs();
    expect(docs.steps).toEqual([]);
  });

  test("heading(1) overload returns NodeMatcher with CombinatorSymbol", () => {
    const matcher = heading(1);
    expect(typeof matcher).toBe("function");
    expect(getCombinator(matcher)).not.toBeNull();
    const fakeHeading = {
      type: "heading",
      depth: 1,
      children: [],
      raw: "# H",
    };
    expect(matcher(fakeHeading as any)).toBe(true);
  });

  test("heading(1, 'text') overload returns Yieldable<void>", () => {
    const y = heading(1, "Hello");
    expect((y as any)[YieldableSymbol]).toBe(true);
  });

  test("paragraph() overload returns NodeMatcher", () => {
    const matcher = paragraph();
    expect(typeof matcher).toBe("function");
    expect(getCombinator(matcher)).not.toBeNull();
  });

  test("paragraph('text') overload returns Yieldable<void>", () => {
    const y = paragraph("Hello world");
    expect((y as any)[YieldableSymbol]).toBe(true);
  });

  test("codeBlock({ lang: 'ts' }) overload returns NodeMatcher", () => {
    const matcher = codeBlock({ lang: "ts" });
    expect(typeof matcher).toBe("function");
    expect(getCombinator(matcher)).not.toBeNull();
  });

  test("codeBlock('ts', 'code') overload returns Yieldable<void>", () => {
    const y = codeBlock("ts", "const x = 1;");
    expect((y as any)[YieldableSymbol]).toBe(true);
  });

  test("Full roundtrip: parse then stringify produces equivalent markdown", () => {
    const format = datamark({
      *parse(doc) {
        const h = yield* doc.consume(heading(1));
        const p = yield* doc.consume(paragraph());
        return {
          title: headingText(h),
          body: (p as any).children.map((c: any) => c.value).join(""),
        };
      },
      *stringify(doc, data) {
        yield* heading(1, data.title);
        yield* paragraph(data.body);
      },
    });
    const input = "# Hello\n\nThis is a test.";
    const parsed = format.parse(input);
    const output = format.stringify(parsed);
    expect(output).toContain("# Hello");
    expect(output).toContain("This is a test.");
  });

  test("Full workflow: create format, trace, docs, test all work", () => {
    const format = datamark({
      description: "Test format",
      examples: ["# Title"],
      *parse(doc) {
        const h = yield* doc.consume(heading(1));
        return { title: headingText(h) };
      },
      *stringify(doc, data) {
        yield* heading(1, data.title);
      },
    });
    const trace = format.trace("# Title");
    expect(trace.steps.length).toBeGreaterThan(0);
    const docs = format.docs();
    expect(docs.description).toBe("Test format");
    const testResult = format.test();
    expect(testResult.passed).toBe(true);
  });

  test("Format with frontmatter schema", () => {
    const format = datamark({
      schema: mockSchema((data) => {
        if (data && typeof data === "object" && "id" in data) return { value: data };
        return { issues: [{ message: "Missing id" }] };
      }),
      *parse(doc) {
        const fm = yield* doc.consumeFrontmatter();
        return { id: (fm as any)?.id ?? "", title: (fm as any)?.title ?? "" };
      },
      *stringify(doc, data) {
        yield* doc.emitFrontmatter({ id: data.id, title: data.title });
      },
    });
    const input = "---\nid: abc\n---\n\n# Hello";
    const result = format.parse(input);
    expect(result.id).toBe("abc");
  });

  test("Format with many, optional, splitBy combinators", () => {
    const format = datamark({
      *parse(doc) {
        const title = yield* doc.consume(heading(1));
        const h2s = yield* doc.consume(many(heading(2)));
        const maybeH3 = yield* doc.consume(optional(heading(3)));
        const sections = yield* doc.consume(splitBy(heading(3)));
        return {
          title: headingText(title),
          h2s: h2s.length,
          maybeH3: maybeH3 ? headingText(maybeH3) : null,
          sections: sections.length,
        };
      },
    });
    const input =
      "# Title\n\n## A\n\n## B\n\n### C\n\nText\n\n### D\n\nMore";
    const result = format.parse(input);
    expect(result.title).toBe("Title");
    expect(result.h2s).toBe(2);
    expect(result.maybeH3).toBe("C");
    expect(result.sections).toBe(2);
  });

  test("Format with repeat", () => {
    const format = datamark({
      *parse(doc) {
        const hs = yield* doc.consume(repeat(2, heading(2)));
        return { count: hs.length };
      },
    });
    const input = "## A\n\n## B\n\n## C";
    const result = format.parse(input);
    expect(result.count).toBe(2);
  });

  test("Format examples with data field are tested for exact match", () => {
    const format = datamark({
      examples: [{ text: "# Hello", data: { title: "Hello" } }],
      *parse(doc) {
        const h = yield* doc.consume(heading(1));
        return { title: headingText(h) };
      },
    });
    const result = format.test();
    expect(result.passed).toBe(true);
    expect(result.failures).toHaveLength(0);
  });

  test("Format examples string-only are tested for parseability only", () => {
    const format = datamark({
      examples: ["# Just a heading"],
      *parse(doc) {
        const h = yield* doc.consume(heading(1));
        return { title: headingText(h) };
      },
    });
    const result = format.test();
    expect(result.passed).toBe(true);
  });
});
