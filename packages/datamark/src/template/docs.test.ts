import { describe, test, expect } from "bun:test";
import { docs } from "./docs";
import { heading, paragraph, codeBlock, splitBy, until, rest, optional, many } from "./parse";
import { TemplateParseError } from "./types";

describe("docs", () => {
  test("records all combinators called in parse generator", () => {
    const docsGen = docs(function* (doc) {
      yield* doc.consumeFrontmatter();
      yield* doc.consume(heading(1));
      yield* doc.consume(paragraph());
      return {};
    });
    const result = docsGen();
    const combinators = result.steps.map((s) => s.combinator);
    expect(combinators).toContain("consumeFrontmatter");
    expect(combinators).toContain("heading(1)");
    expect(combinators).toContain("paragraph()");
  });

  test("records metadata (description, examples)", () => {
    const docsGen = docs(function* (doc) {
      const y = (doc.consume(heading(1)) as any)
        .description("The title")
        .examples(["# Title"]) as ReturnType<typeof doc.consume>;
      yield* y;
      return {};
    });
    const result = docsGen();
    const step = result.steps[0]!;
    expect(step.description).toBe("The title");
    expect(step.examples).toEqual(["# Title"]);
  });

  test("synthetic frontmatter", () => {
    const docsGen = docs(function* (doc) {
      const fm = yield* doc.consumeFrontmatter();
      // Access synthetic frontmatter properties to verify shape
      const _ = fm.id + fm.title;
      return _;
    });
    expect(() => docsGen()).not.toThrow();
    const result = docsGen();
    expect(result.steps[0]!.combinator).toBe("consumeFrontmatter");
  });

  test("synthetic heading(1) and heading(3) — depth parsed from combinator name regex", () => {
    const docsGen = docs(function* (doc) {
      const h1 = yield* doc.consume(heading(1));
      const h3 = yield* doc.consume(heading(3));
      const _ = h1.depth + h3.depth + h1.type + h3.type;
      return _;
    });
    expect(() => docsGen()).not.toThrow();
    const result = docsGen();
    expect(result.steps[0]!.combinator).toBe("heading(1)");
    expect(result.steps[1]!.combinator).toBe("heading(3)");
  });

  test("synthetic paragraph()", () => {
    const docsGen = docs(function* (doc) {
      const p = yield* doc.consume(paragraph());
      const _ = p.type + p.children[0].value;
      return _;
    });
    expect(() => docsGen()).not.toThrow();
    const result = docsGen();
    expect(result.steps[0]!.combinator).toBe("paragraph()");
  });

  test("synthetic codeBlock({ lang: 'ts' }) — lang extracted from name string", () => {
    const docsGen = docs(function* (doc) {
      const c = yield* doc.consume(codeBlock({ lang: "ts" }));
      const _ = c.type + c.lang;
      return _;
    });
    expect(() => docsGen()).not.toThrow();
    const result = docsGen();
    expect(result.steps[0]!.combinator).toBe('codeBlock({ lang: "ts" })');
  });

  test("synthetic codeBlock() without lang", () => {
    const docsGen = docs(function* (doc) {
      const c = yield* doc.consume(codeBlock());
      const _ = c.type;
      return _;
    });
    expect(() => docsGen()).not.toThrow();
    const result = docsGen();
    expect(result.steps[0]!.combinator).toBe("codeBlock()");
  });

  test("synthetic splitBy(...), until(...), rest() → []", () => {
    const docsGen = docs(function* (doc) {
      const s = yield* doc.consume(splitBy(heading(1)));
      const u = yield* doc.consume(until((n: any) => n.type === "heading"));
      const r = yield* doc.consume(rest());
      if (!Array.isArray(s) || !Array.isArray(u) || !Array.isArray(r)) {
        throw new Error("expected arrays");
      }
      return { s, u, r };
    });
    expect(() => docsGen()).not.toThrow();
    const result = docsGen();
    expect(result.steps).toHaveLength(3);
  });

  test("unknown combinator name → undefined synthetic value", () => {
    const custom = (() => null) as any;
    custom._combinatorName = "unknown()";

    const docsGen = docs(function* (doc) {
      const val = yield* doc.consume(custom);
      return val;
    });
    // Should not throw because syntheticValue returns undefined for unknown names
    expect(() => docsGen()).not.toThrow();
    const result = docsGen();
    expect(result.steps[0]!.combinator).toBe("unknown()");
  });

  test("unknown yieldable → TemplateParseError", () => {
    const docsGen = docs(function* (doc) {
      yield { _tag: "unknown", [Symbol.for("datamark.yieldable")]: true } as any;
      return {};
    });
    expect(() => docsGen()).toThrow(TemplateParseError);
  });

  test("combinator fails in docs mode → TemplateParseError", () => {
    const docsGen = docs(function* (doc) {
      // Yield a custom yieldable whose run returns null
      const y = {
        _tag: "consume",
        [Symbol.for("datamark.yieldable")]: true,
        run: () => null,
      } as any;
      yield y;
      return {};
    });
    expect(() => docsGen()).toThrow(TemplateParseError);
  });

  test("docs() returns { steps }", () => {
    const docsGen = docs(function* (doc) {
      yield* doc.consume(heading(1));
      return {};
    });
    const result = docsGen();
    expect(result).toHaveProperty("steps");
    expect(Array.isArray(result.steps)).toBe(true);
  });

  test("multiple combinators recorded in order", () => {
    const docsGen = docs(function* (doc) {
      yield* doc.consumeFrontmatter();
      yield* doc.consume(heading(1));
      yield* doc.consume(paragraph());
      yield* doc.consume(codeBlock());
      return {};
    });
    const result = docsGen();
    expect(result.steps).toHaveLength(4);
    expect(result.steps[0]!.combinator).toBe("consumeFrontmatter");
    expect(result.steps[1]!.combinator).toBe("heading(1)");
    expect(result.steps[2]!.combinator).toBe("paragraph()");
    expect(result.steps[3]!.combinator).toBe("codeBlock()");
  });

  test("consumeFrontmatter recorded", () => {
    const docsGen = docs(function* (doc) {
      yield* doc.consumeFrontmatter();
      return {};
    });
    const result = docsGen();
    expect(result.steps).toHaveLength(1);
    expect(result.steps[0]!.combinator).toBe("consumeFrontmatter");
  });

  test("empty parse generator → empty steps", () => {
    const docsGen = docs(function* () {
      return {};
    });
    const result = docsGen();
    expect(result.steps).toHaveLength(0);
  });

  test("verify synthetic nodes have correct shape (HeadingNode has type 'heading', etc.)", () => {
    const docsGen = docs(function* (doc) {
      const fm = yield* doc.consumeFrontmatter();
      const h = yield* doc.consume(heading(1));
      const p = yield* doc.consume(paragraph());
      const c = yield* doc.consume(codeBlock({ lang: "ts" }));
      const _ =
        fm.id +
        h.type +
        h.depth +
        p.type +
        c.type +
        c.lang;
      return _;
    });
    // If synthetic nodes lack expected properties, this throws
    expect(() => docsGen()).not.toThrow();
    const result = docsGen();
    expect(result.steps).toHaveLength(4);
  });

  test("docs runner doesn't throw on optional combinators", () => {
    const docsGen = docs(function* (doc) {
      yield* doc.consume(optional(heading(2)));
      return {};
    });
    expect(() => docsGen()).not.toThrow();
    const result = docsGen();
    expect(result.steps).toHaveLength(1);
  });

  test("docs runner handles many() by recording it once (synthetic path succeeds)", () => {
    const docsGen = docs(function* (doc) {
      yield* doc.consume(many(paragraph()));
      return {};
    });
    expect(() => docsGen()).not.toThrow();
    const result = docsGen();
    expect(result.steps).toHaveLength(1);
  });
});
