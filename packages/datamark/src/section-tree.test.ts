import { describe, test, expect } from "bun:test";
import { buildSectionTree } from "./tree";
import type { BlockNode, SectionNode } from "./tree";

function h(depth: number, text: string): BlockNode {
  return {
    type: "heading",
    depth,
    children: [{ type: "text", value: text, raw: text }],
    raw: `${"#".repeat(depth)} ${text}`,
  } as BlockNode;
}

function p(text: string): BlockNode {
  return {
    type: "paragraph",
    children: [{ type: "text", value: text, raw: text }],
    raw: text,
  } as BlockNode;
}

function getSections(root: SectionNode): SectionNode[] {
  return root.children.filter((n) => n.type === "section") as SectionNode[];
}

function getBody(root: SectionNode): BlockNode[] {
  return root.children.filter((n) => n.type !== "section") as BlockNode[];
}

describe("buildSectionTree", () => {
  test("empty document", () => {
    const root = buildSectionTree([]);
    expect(root.type).toBe("section");
    expect(root.heading).toBeNull();
    expect(root.children).toEqual([]);
  });

  test("document with no headings", () => {
    const root = buildSectionTree([p("A"), p("B")]);
    expect(root.heading).toBeNull();
    expect(getBody(root)).toHaveLength(2);
    expect(getSections(root)).toHaveLength(0);
  });

  test("single heading at start", () => {
    const root = buildSectionTree([h(1, "Title"), p("Body")]);
    expect(root.heading).toBeNull();
    expect(getSections(root)).toHaveLength(1);
    const titleSection = getSections(root)[0]!;
    expect(titleSection.heading!.depth).toBe(1);
    expect(getBody(titleSection)).toHaveLength(1);
  });

  test("content before first heading", () => {
    const root = buildSectionTree([p("Pre"), h(1, "Title"), p("Body")]);
    expect(getBody(root)).toHaveLength(1);
    expect(getSections(root)).toHaveLength(1);
    expect(getSections(root)[0]!.heading!.depth).toBe(1);
  });

  test("h1 → h2 → h3 nested", () => {
    const root = buildSectionTree([h(1, "A"), p("a"), h(2, "B"), p("b"), h(3, "C"), p("c")]);
    const h1s = getSections(root);
    expect(h1s).toHaveLength(1);
    const h1 = h1s[0]!;
    expect(h1.heading!.depth).toBe(1);
    expect(getBody(h1)).toHaveLength(1); // p("a")

    const h2s = getSections(h1);
    expect(h2s).toHaveLength(1);
    const h2 = h2s[0]!;
    expect(h2.heading!.depth).toBe(2);
    expect(getBody(h2)).toHaveLength(1); // p("b")

    const h3s = getSections(h2);
    expect(h3s).toHaveLength(1);
    expect(h3s[0]!.heading!.depth).toBe(3);
    expect(getBody(h3s[0]!)).toHaveLength(1); // p("c")
  });

  test("h2 → h1: h1 pops h2, becomes sibling of root", () => {
    const root = buildSectionTree([h(2, "A"), p("a"), h(1, "B"), p("b")]);
    const sections = getSections(root);
    expect(sections).toHaveLength(2);
    expect(sections[0]!.heading!.depth).toBe(2);
    expect(sections[1]!.heading!.depth).toBe(1);
  });

  test("multiple same-depth headings are siblings", () => {
    const root = buildSectionTree([h(2, "A"), p("a"), h(2, "B"), p("b"), h(2, "C"), p("c")]);
    const sections = getSections(root);
    expect(sections).toHaveLength(3);
    expect(sections[0]!.heading!.depth).toBe(2);
    expect(sections[1]!.heading!.depth).toBe(2);
    expect(sections[2]!.heading!.depth).toBe(2);
  });

  test("h1 → h6 → h6 → h2: h2 pops both h6s from stack", () => {
    const root = buildSectionTree([h(1, "A"), h(6, "B"), h(6, "C"), h(2, "D"), p("d")]);
    const h1s = getSections(root);
    expect(h1s).toHaveLength(1);
    const h1 = h1s[0]!;
    const h1SubSections = getSections(h1);
    // h1 has three subsections: two h6s and one h2
    expect(h1SubSections).toHaveLength(3);
    expect(h1SubSections[0]!.heading!.depth).toBe(6);
    expect(h1SubSections[1]!.heading!.depth).toBe(6);
    expect(h1SubSections[2]!.heading!.depth).toBe(2);
    expect(getBody(h1SubSections[2]!)).toHaveLength(1);
  });

  test("heading at end of document: section with empty body", () => {
    const root = buildSectionTree([p("A"), h(2, "B")]);
    const sections = getSections(root);
    expect(sections).toHaveLength(1);
    expect(sections[0]!.heading!.depth).toBe(2);
    expect(getBody(sections[0]!)).toHaveLength(0);
  });

  test("h1 only: root with empty body, single child section", () => {
    const root = buildSectionTree([h(1, "Title")]);
    expect(getBody(root)).toHaveLength(0);
    expect(getSections(root)).toHaveLength(1);
    expect(getSections(root)[0]!.heading!.depth).toBe(1);
    expect(getBody(getSections(root)[0]!)).toHaveLength(0);
  });

  test("mixed content between headings", () => {
    const root = buildSectionTree([
      h(1, "A"),
      p("para"),
      { type: "code", lang: "js", value: "x", raw: "```js\nx\n```" } as BlockNode,
      h(2, "B"),
      { type: "list", ordered: false, children: [], raw: "- item" } as BlockNode,
    ]);
    const h1s = getSections(root);
    expect(h1s).toHaveLength(1);
    expect(getBody(h1s[0]!)).toHaveLength(2); // para + code
    const h2s = getSections(h1s[0]!);
    expect(h2s).toHaveLength(1);
    expect(getBody(h2s[0]!)).toHaveLength(1); // list
  });

  test("h11 works at any depth", () => {
    const root = buildSectionTree([h(11, "Deep"), p("body")]);
    expect(getSections(root)).toHaveLength(1);
    expect(getSections(root)[0]!.heading!.depth).toBe(11);
  });

  test("consecutive headings with no body", () => {
    const root = buildSectionTree([h(1, "A"), h(2, "B"), h(3, "C")]);
    const h1s = getSections(root);
    expect(h1s).toHaveLength(1);
    const h2s = getSections(h1s[0]!);
    expect(h2s).toHaveLength(1);
    const h3s = getSections(h2s[0]!);
    expect(h3s).toHaveLength(1);
    expect(getBody(h1s[0]!)).toHaveLength(0);
    expect(getBody(h2s[0]!)).toHaveLength(0);
    expect(getBody(h3s[0]!)).toHaveLength(0);
  });

  test("h3 without parent h2/h1: orphan goes under root", () => {
    const root = buildSectionTree([p("intro"), h(3, "Orphan"), p("body")]);
    expect(getBody(root)).toHaveLength(1); // intro
    expect(getSections(root)).toHaveLength(1);
    expect(getSections(root)[0]!.heading!.depth).toBe(3);
  });
});
