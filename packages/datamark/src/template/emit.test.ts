import { describe, test, expect } from "bun:test";
import { parse as parseDocument } from "../document";
import {
  createYieldable,
  createEmitYieldable,
} from "./yieldable";
import {
  emit,
  heading,
  paragraph,
  codeBlock,
  hr,
  markdown,
  todoItem,
} from "./emit";

describe("Basic emit", () => {
  test("frontmatter + heading → markdown string", () => {
    const fn = emit(function* (doc, data) {
      yield* doc.emitFrontmatter({ id: data.id });
      yield* heading(1, data.title);
    });
    const result = fn({ id: "1", title: "Hello" });
    expect(result).toContain("---");
    expect(result).toContain('id: "1"');
    expect(result).toContain("# Hello");
  });

  test("emitFrontmatter sets frontmatter", () => {
    let captured: any = null;
    const fn = emit(function* (doc, data) {
      yield* doc.emitFrontmatter({ id: data.id });
      captured = doc.toDocument().frontmatter;
    });
    fn({ id: "1" });
    expect(captured).toEqual({ id: "1" });
  });

  test("toDocument returns correct Document", () => {
    let doc: any = null;
    const fn = emit(function* (d, data) {
      yield* d.emitFrontmatter({ title: "T" });
      yield* heading(1, "Title");
      doc = d.toDocument();
    });
    fn(null);
    expect(doc.type).toBe("document");
    expect(doc.frontmatter).toEqual({ title: "T" });
    expect(doc.children).toHaveLength(1);
    expect(doc.children[0].type).toBe("heading");
  });

  test('heading(1, "Title") produces correct markdown', () => {
    const fn = emit(function* (doc, data) {
      yield* heading(1, "Title");
    });
    expect(fn(null)).toBe("# Title\n");
  });

  test('heading(6, "Deep") produces correct markdown', () => {
    const fn = emit(function* (doc, data) {
      yield* heading(6, "Deep");
    });
    expect(fn(null)).toBe("###### Deep\n");
  });

  test('paragraph("text") produces correct markdown', () => {
    const fn = emit(function* (doc, data) {
      yield* paragraph("text");
    });
    expect(fn(null)).toBe("text\n");
  });

  test('codeBlock("ts", "const x = 1;") produces correct markdown with fences', () => {
    const fn = emit(function* (doc, data) {
      yield* codeBlock("ts", "const x = 1;");
    });
    const result = fn(null);
    expect(result).toContain("```ts");
    expect(result).toContain("const x = 1;");
  });

  test('codeBlock with lang containing spaces (e.g., "json tool") → splits to lang="json" meta="tool"', () => {
    const fn = emit(function* (doc, data) {
      yield* codeBlock("json tool", "x");
    });
    const result = fn(null);
    expect(result).toContain("```json tool");
    const doc = parseDocument(result);
    const code = doc.children[0] as any;
    expect(code.lang).toBe("json");
    expect(code.meta).toBe("tool");
  });

  test("codeBlock with empty lang", () => {
    const fn = emit(function* (doc, data) {
      yield* codeBlock("", "x");
    });
    const result = fn(null);
    expect(result).toContain("```");
    expect(result).not.toContain("``` ");
  });

  test("hr() produces ---", () => {
    const fn = emit(function* (doc, data) {
      yield* hr();
    });
    expect(fn(null)).toBe("---\n");
  });

  test('markdown("## Hello\\n\\nText.") emits parsed nodes as markdown', () => {
    const fn = emit(function* (doc, data) {
      yield* markdown("## Hello\n\nText.");
    });
    expect(fn(null)).toBe("## Hello\n\nText.\n");
  });

  test('markdown("") → no nodes', () => {
    const fn = emit(function* (doc, data) {
      yield* markdown("");
    });
    expect(fn(null)).toBe("\n");
  });

  test('todoItem("Task", false) → list with [ ]', () => {
    const fn = emit(function* (doc, data) {
      yield* todoItem("Task", false);
    });
    expect(fn(null)).toContain("- [ ] Task");
  });

  test('todoItem("Task", true) → [x]', () => {
    const fn = emit(function* (doc, data) {
      yield* todoItem("Task", true);
    });
    expect(fn(null)).toContain("- [x] Task");
  });

  test("todoItem with special chars", () => {
    const fn = emit(function* (doc, data) {
      yield* todoItem("A & B <>", false);
    });
    expect(fn(null)).toContain("- [ ] A & B <>");
  });

  test("Multiple emit calls accumulate", () => {
    const fn = emit(function* (doc, data) {
      yield* paragraph("A");
      yield* paragraph("B");
    });
    expect(fn(null)).toBe("A\n\nB\n");
  });

  test("emitNode raw node directly", () => {
    const fn = emit(function* (doc, data) {
      doc.emitNode({ type: "hr", raw: "---" });
      doc.emitNode({
        type: "paragraph",
        children: [{ type: "text", value: "hi", raw: "hi" }],
        raw: "hi",
      });
    });
    expect(fn(null)).toBe("---\n\nhi\n");
  });

  test("Unknown yieldable → Error thrown", () => {
    const fn = emit(function* (doc, data) {
      yield* createYieldable("bad", "bad", () => null) as any;
    });
    expect(() => fn(null)).toThrow("Unknown yieldable in emit generator: bad");
  });

  test("Roundtrip: emit → stringifyDocument → parseable", () => {
    const fn = emit(function* (doc, data) {
      yield* doc.emitFrontmatter({ title: data.title });
      yield* heading(1, data.title);
      yield* paragraph(data.body);
    });
    const md = fn({ title: "Hello", body: "World" });
    const parsed = parseDocument(md);
    const nonSpace = parsed.children.filter((n: any) => n.type !== "space");
    expect(nonSpace).toHaveLength(2);
    expect(nonSpace[0].type).toBe("heading");
    expect(nonSpace[1].type).toBe("paragraph");
  });

  test("Combined: frontmatter + heading + paragraph + code + hr", () => {
    const fn = emit(function* (doc, data) {
      yield* doc.emitFrontmatter({ id: "1" });
      yield* heading(1, "Title");
      yield* paragraph("Text");
      yield* codeBlock("ts", "const x = 1;");
      yield* hr();
    });
    const result = fn(null);
    expect(result).toContain("---");
    expect(result).toContain("# Title");
    expect(result).toContain("Text");
    expect(result).toContain("```ts");
    expect(result).toContain("---");
  });

  test("emitFrontmatter overwrites on second call", () => {
    let doc: any = null;
    const fn = emit(function* (d, data) {
      yield* d.emitFrontmatter({ id: "1" });
      yield* d.emitFrontmatter({ id: "2" });
      doc = d.toDocument();
    });
    fn(null);
    expect(doc.frontmatter).toEqual({ id: "2" });
  });

  test("emit returns newline for empty generator", () => {
    const fn = emit(function* (doc, data) {
      // nothing emitted
    });
    expect(fn(null)).toBe("\n");
  });
});
