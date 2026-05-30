import { describe, test, expect } from "bun:test";
import { trace } from "./trace";
import { heading, paragraph, codeBlock, splitBy, optional, many, until, rest } from "./parse";
import { TemplateParseError } from "./types";

describe("trace", () => {
  test("basic trace: records steps for frontmatter + heading + paragraph", () => {
    const tracer = trace(function* (doc) {
      const fm = yield* doc.consumeFrontmatter();
      const title = yield* doc.consume(heading(1));
      const body = yield* doc.consume(paragraph());
      return { fm, title, body };
    });

    const result = tracer("---\nid: test\n---\n\n# Title\n\nHello world.");
    expect(result.steps).toHaveLength(3);
    expect(result.steps[0]!.type).toBe("consumeFrontmatter");
    expect(result.steps[1]!.type).toBe("consume");
    expect(result.steps[2]!.type).toBe("consume");
  });

  test("records consumeFrontmatter step with correct type", () => {
    const tracer = trace(function* (doc) {
      yield* doc.consumeFrontmatter();
      return {};
    });
    const result = tracer("---\nfoo: bar\n---");
    expect(result.steps[0]!.type).toBe("consumeFrontmatter");
    expect(result.steps[0]!.combinator).toBe("consumeFrontmatter");
  });

  test("records consume steps with consumed nodes", () => {
    const tracer = trace(function* (doc) {
      yield* doc.consumeFrontmatter();
      yield* doc.consume(heading(1));
      yield* doc.consume(paragraph());
      return {};
    });
    const result = tracer("---\nfoo: bar\n---\n\n# H\n\nP");
    const consumeSteps = result.steps.filter((s) => s.type === "consume");
    expect(consumeSteps).toHaveLength(2);
    expect(consumeSteps[0]!.consumed.some((n) => n.type === "heading")).toBe(true);
    expect(consumeSteps[1]!.consumed.some((n) => n.type === "paragraph")).toBe(true);
  });

  test("records metadata (description, examples) attached via .description()/.examples()", () => {
    const tracer = trace(function* (doc) {
      yield* doc.consumeFrontmatter();
      const y = (doc.consume(heading(1)) as any).description("The title").examples(["# Title"]) as ReturnType<typeof doc.consume>;
      yield* y;
      return {};
    });
    const result = tracer("---\nfoo: bar\n---\n\n# Title\n\nBody.");
    const step = result.steps.find((s) => s.combinator === "heading(1)")!;
    expect(step.description).toBe("The title");
    expect(step.examples).toEqual(["# Title"]);
  });

  test("source regions are correct line/col numbers", () => {
    const tracer = trace(function* (doc) {
      yield* doc.consumeFrontmatter();
      yield* doc.consume(heading(1));
      yield* doc.consume(paragraph());
      return {};
    });
    const result = tracer("---\nfoo: bar\n---\n\n# Title\n\nHello world.");
    const hStep = result.steps[1]!;
    const pStep = result.steps[2]!;
    expect(hStep.region.start.line).toBeGreaterThanOrEqual(1);
    expect(pStep.region.start.line).toBeGreaterThanOrEqual(hStep.region.start.line);
    expect(hStep.region.start.column).toBeGreaterThanOrEqual(1);
    expect(pStep.region.start.column).toBeGreaterThanOrEqual(1);
  });

  test("trace.result matches normal parse result", () => {
    const tracer = trace(function* (doc) {
      const fm = yield* doc.consumeFrontmatter();
      const h = yield* doc.consume(heading(1));
      return { fm, text: h.children[0]!.type === "text" ? h.children[0]!.value : "" };
    });
    const result = tracer("---\nid: x\n---\n\n# Hello");
    expect(result.result.text).toBe("Hello");
    expect(result.result.fm).toEqual({ id: "x" });
  });

  test("trace.document has full AST with positions", () => {
    const tracer = trace(function* (doc) {
      yield* doc.consumeFrontmatter();
      yield* doc.consume(heading(1));
      return {};
    });
    const result = tracer("# Hello\n\nWorld.");
    expect(result.document.type).toBe("document");
    expect(result.document.children.length).toBeGreaterThanOrEqual(1);
    expect(result.document.children[0]!.position).toBeDefined();
  });

  test("step type 'consumeFrontmatter' for frontmatter", () => {
    const tracer = trace(function* (doc) {
      yield* doc.consumeFrontmatter();
      return {};
    });
    const result = tracer("---\na: 1\n---");
    expect(result.steps.every((s) => s.type === "consumeFrontmatter")).toBe(true);
  });

  test("step type 'consume' for combinators", () => {
    const tracer = trace(function* (doc) {
      yield* doc.consume(heading(1));
      yield* doc.consume(paragraph());
      return {};
    });
    const result = tracer("# H\n\nP");
    expect(result.steps.every((s) => s.type === "consume")).toBe(true);
  });

  test("consumed array empty for frontmatter", () => {
    const tracer = trace(function* (doc) {
      yield* doc.consumeFrontmatter();
      return {};
    });
    const result = tracer("---\na: 1\n---");
    expect(result.steps[0]!.consumed).toHaveLength(0);
  });

  test("consumed array has correct nodes for combinators", () => {
    const tracer = trace(function* (doc) {
      yield* doc.consume(heading(1));
      yield* doc.consume(paragraph());
      return {};
    });
    const result = tracer("# H\n\nP\n\nQ");
    expect(result.steps[0]!.consumed.some((n) => n.type === "heading")).toBe(true);
    expect(result.steps[1]!.consumed.some((n) => n.type === "paragraph")).toBe(true);
  });

  test("region spans from first to last consumed node position", () => {
    const tracer = trace(function* (doc) {
      yield* doc.consume(heading(1));
      yield* doc.consume(paragraph());
      return {};
    });
    const result = tracer("# A\n\nB\n\n# C");
    const pStep = result.steps[1]!;
    expect(pStep.region.start.offset).toBeLessThan(pStep.region.end.offset);
  });

  test("region default {line:1, col:1} for empty consumed", () => {
    const tracer = trace(function* (doc) {
      yield* doc.consumeFrontmatter();
      return {};
    });
    const result = tracer("");
    const step = result.steps[0]!;
    expect(step.region.start.line).toBe(1);
    expect(step.region.start.column).toBe(1);
    expect(step.region.end.line).toBe(1);
    expect(step.region.end.column).toBe(1);
  });

  test("unknown yieldable → TemplateParseError", () => {
    const tracer = trace(function* (doc) {
      yield { _tag: "unknown", [Symbol.for("datamark.yieldable")]: true } as any;
      return {};
    });
    expect(() => tracer("# H")).toThrow(TemplateParseError);
  });

  test("combinator fails during trace → TemplateParseError", () => {
    const tracer = trace(function* (doc) {
      yield* doc.consume(heading(2));
      return {};
    });
    expect(() => tracer("# H")).toThrow(TemplateParseError);
  });

  test("trace with optional (succeeds branch)", () => {
    const tracer = trace(function* (doc) {
      const h = yield* doc.consume(optional(heading(2)));
      return { h };
    });
    const result = tracer("## H");
    expect(result.steps).toHaveLength(1);
    expect(result.steps[0]!.matched).toBeDefined();
    expect((result.steps[0]!.matched as any).type).toBe("heading");
  });

  test("trace with many (records multiple consumptions)", () => {
    const tracer = trace(function* (doc) {
      const ps = yield* doc.consume(many(paragraph()));
      return { ps };
    });
    const result = tracer("P1\n\nP2\n\nP3");
    expect(result.steps).toHaveLength(1);
    expect((result.result.ps as any[])).toHaveLength(3);
  });

  test("trace with splitBy", () => {
    const tracer = trace(function* (doc) {
      const groups = yield* doc.consume(splitBy(heading(2)));
      return { groups };
    });
    const result = tracer("A\n\n## B\n\nC");
    expect(result.steps).toHaveLength(1);
    expect((result.result.groups as any[])).toHaveLength(2);
  });

  test("trace with metadata on every combinator", () => {
    const tracer = trace(function* (doc) {
      const y1 = (doc.consume(heading(1)) as any).description("Title").examples(["# T"]) as ReturnType<typeof doc.consume>;
      yield* y1;
      const y2 = (doc.consume(paragraph()) as any).description("Body") as ReturnType<typeof doc.consume>;
      yield* y2;
      return {};
    });
    const result = tracer("# T\n\nB");
    expect(result.steps[0]!.description).toBe("Title");
    expect(result.steps[0]!.examples).toEqual(["# T"]);
    expect(result.steps[1]!.description).toBe("Body");
  });

  test("trace empty document (no steps or minimal)", () => {
    const tracer = trace(function* (doc) {
      yield* doc.consumeFrontmatter();
      return { done: true };
    });
    const result = tracer("");
    expect(result.steps).toHaveLength(1);
    expect(result.steps[0]!.type).toBe("consumeFrontmatter");
    expect(result.result).toEqual({ done: true });
  });
});
