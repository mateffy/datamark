import { describe, test, expect } from "bun:test";
import {
  isHeading,
  isCodeBlock,
  isTodoItem,
  extractTodoItems,
  find,
  findAll,
  filter,
  sectionsAtDepth,
  sectionsByHeading,
  splitBy,
  between,
  after,
  before,
  codeBlocks,
  inlineText,
  textContent,
  toMarkdown,
  flatten,
} from "./tree-utils";
import { buildSectionTree } from "./tree";
import type { BlockNode, InlineNode, ListItemNode } from "./tree";

// Helpers to build nodes without parsing
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

function code(value: string, lang?: string, meta?: string): BlockNode {
  const fence = "```" + (lang ?? "") + (meta ? ` ${meta}` : "") + "\n" + value + "\n```";
  return { type: "code", lang, meta, value, raw: fence } as BlockNode;
}

function bq(...children: BlockNode[]): BlockNode {
  const raw = "> " + children.map((c) => (c as any).raw).join("\n> ");
  return { type: "blockquote", children, raw } as BlockNode;
}

function hr(): BlockNode {
  return { type: "hr", raw: "---" } as BlockNode;
}

function liItem(...children: BlockNode[]): ListItemNode {
  const raw = children.map((n) => (n as any).raw).join("\n");
  return { type: "listItem", children, raw };
}

function li(...items: ListItemNode[]): BlockNode {
  const raw = items.map((item) => item.children.map((n) => (n as any).raw).join("\n")).join("\n");
  return { type: "list", ordered: false, children: items, raw } as BlockNode;
}

function oli(start: number, ...items: ListItemNode[]): BlockNode {
  const raw = items.map((item, i) => `${start + i}. ${item.children.map((n) => (n as any).raw).join("\n")}`).join("\n");
  return { type: "list", ordered: true, start, children: items, raw } as BlockNode;
}

function space(): BlockNode {
  return { type: "space", raw: "\n\n" } as BlockNode;
}

function sectionNode(heading: BlockNode | null, ...children: BlockNode[]): any {
  return {
    type: "section",
    heading: heading as any,
    children: children as any,
    raw: "",
  };
}

describe("isHeading", () => {
  test("true for heading without depth filter", () => {
    expect(isHeading(h(2, "A"))).toBe(true);
  });

  test("false for non-heading", () => {
    expect(isHeading(p("A"))).toBe(false);
  });
});

describe("isCodeBlock", () => {
  test("true for code without lang filter", () => {
    expect(isCodeBlock(code("a"))).toBe(true);
  });

  test("false for non-code", () => {
    expect(isCodeBlock(p("A"))).toBe(false);
  });
});

describe("isTodoItem", () => {
  test("true for [ ] todo", () => {
    expect(isTodoItem(li(liItem(p("[ ] a"))))).toBe(true);
  });

  test("false for regular list", () => {
    expect(isTodoItem(li(liItem(p("normal"))))).toBe(false);
  });

  test("false for blockquote non-todo", () => {
    expect(isTodoItem(bq(p("[ ] a")))).toBe(false);
  });
});

describe("extractTodoItems", () => {
  test("extracts from list", () => {
    const items = extractTodoItems([li(liItem(p("[ ] a")), liItem(p("[x] b")))]);
    expect(items).toHaveLength(2);
    expect(items[0]!.completed).toBe(false);
    expect(items[1]!.completed).toBe(true);
  });

  test("extracts from nested blockquote", () => {
    const items = extractTodoItems([bq(li(liItem(p("[X] nested"))))]);
    expect(items).toHaveLength(1);
    expect(items[0]!.text).toBe("nested");
  });

  test("empty array returns []", () => {
    expect(extractTodoItems([])).toEqual([]);
  });
});

describe("find", () => {
  const root = sectionNode(null, h(1, "A"), p("B"), bq(h(2, "C")));

  test("finds top level node", () => {
    expect(find(root, (n) => n.type === "paragraph")!.type).toBe("paragraph");
  });

  test("finds nested in blockquote", () => {
    expect(find(root, (n) => isHeading(n, 2))!.type).toBe("heading");
  });

  test("not found returns undefined", () => {
    expect(find(root, (n) => n.type === "code")).toBeUndefined();
  });
});

describe("findAll", () => {
  test("multiple at top level", () => {
    const root = sectionNode(null, h(1, "A"), h(1, "B"), p("C"));
    const res = findAll(root, (n) => n.type === "heading");
    expect(res).toHaveLength(2);
  });

  test("nested in blockquotes", () => {
    const root = sectionNode(null, bq(h(2, "A")), bq(h(2, "B")));
    const res = findAll(root, (n) => isHeading(n, 2));
    expect(res).toHaveLength(2);
  });

  test("none found returns []", () => {
    expect(findAll(p("A"), (n) => n.type === "code")).toEqual([]);
  });
});

describe("filter", () => {
  test("top level only no recursion", () => {
    const nodes: BlockNode[] = [h(1, "A"), bq(h(1, "B"))];
    const res = filter(nodes, (n) => n.type === "heading");
    expect(res).toHaveLength(1);
    expect((res[0] as any).raw).toBe("# A");
  });

  test("none match returns []", () => {
    expect(filter([p("A")], (n) => n.type === "code")).toEqual([]);
  });
});

describe("sectionsAtDepth", () => {
  test("finds sections at depth", () => {
    const root = buildSectionTree([h(1, "A"), p("intro"), h(2, "B"), p("body"), h(2, "C"), p("more")]);
    const h2s = sectionsAtDepth(root, 2);
    expect(h2s).toHaveLength(2);
    expect(h2s[0]!.heading!.children[0]!.value).toBe("B");
  });
});

describe("sectionsByHeading", () => {
  test("finds sections by heading text", () => {
    const root = buildSectionTree([h(1, "A"), h(2, "B"), p("body")]);
    const sections = sectionsByHeading(root, "B");
    expect(sections).toHaveLength(1);
    expect(sections[0]!.heading!.depth).toBe(2);
  });
});

describe("splitBy", () => {
  test("by hr", () => {
    const nodes: BlockNode[] = [p("A"), hr(), p("B")];
    const res = splitBy(nodes, (n) => n.type === "hr");
    expect(res).toHaveLength(2);
    expect(res[0]!).toHaveLength(1);
    expect(res[1]!).toHaveLength(1);
  });

  test("by heading", () => {
    const nodes: BlockNode[] = [p("A"), h(1, "B"), p("C")];
    const res = splitBy(nodes, (n) => n.type === "heading");
    expect(res).toHaveLength(2);
  });

  test("no separators returns single group", () => {
    const res = splitBy([p("A"), p("B")], (n) => n.type === "hr");
    expect(res).toHaveLength(1);
  });
});

describe("between", () => {
  const nodes: BlockNode[] = [p("A"), h(1, "B"), p("C"), hr(), p("D")];

  test("found both", () => {
    const res = between(nodes, (n) => n.type === "heading", (n) => n.type === "hr");
    expect(res).toHaveLength(1);
    expect((res[0] as any).raw).toBe("C");
  });

  test("end not found returns everything after start", () => {
    const res = between(nodes, (n) => n.type === "heading", (n) => n.type === "code");
    expect(res).toHaveLength(3);
  });

  test("start not found returns []", () => {
    const res = between(nodes, (n) => n.type === "code", (n) => n.type === "hr");
    expect(res).toEqual([]);
  });
});

describe("after", () => {
  const nodes: BlockNode[] = [p("A"), h(1, "B"), p("C")];

  test("found", () => {
    expect(after(nodes, (n) => n.type === "heading")).toHaveLength(1);
  });

  test("not found returns []", () => {
    expect(after(nodes, (n) => n.type === "code")).toEqual([]);
  });

  test("predicate is last returns []", () => {
    expect(after(nodes, (n) => n.type === "paragraph" && (n as any).raw === "C")).toEqual([]);
  });
});

describe("before", () => {
  const nodes: BlockNode[] = [p("A"), h(1, "B"), p("C")];

  test("found", () => {
    expect(before(nodes, (n) => n.type === "heading")).toHaveLength(1);
  });

  test("not found returns all nodes", () => {
    expect(before(nodes, (n) => n.type === "code")).toHaveLength(3);
  });

  test("predicate is first returns []", () => {
    expect(before(nodes, (n) => n.type === "paragraph" && (n as any).raw === "A")).toEqual([]);
  });
});

describe("codeBlocks", () => {
  test("extracts recursive from blockquotes", () => {
    const root = sectionNode(null, bq(code("a")), p("b"));
    const res = codeBlocks(root);
    expect(res).toHaveLength(1);
    expect(res[0]!.type).toBe("code");
  });

  test("empty returns []", () => {
    expect(codeBlocks([])).toEqual([]);
  });
});

describe("inlineText", () => {
  test("text node", () => {
    expect(inlineText([{ type: "text", value: "a", raw: "a" }])).toBe("a");
  });

  test("strong nested", () => {
    expect(
      inlineText([{ type: "strong", children: [{ type: "em", children: [{ type: "text", value: "a", raw: "a" }], raw: "*a*" }], raw: "**a**" }])
    ).toBe("a");
  });

  test("image node", () => {
    expect(inlineText([{ type: "image", src: "a.png", alt: "alt", raw: "![alt](a.png)" }])).toBe("alt");
  });

  test("unknown type returns empty string", () => {
    expect(inlineText([{ type: "unknown" } as any])).toBe("");
  });
});

describe("textContent", () => {
  test("heading", () => {
    expect(textContent(h(1, "A"))).toBe("A");
  });

  test("code", () => {
    expect(textContent(code("x"))).toBe("x");
  });

  test("blockquote recursive", () => {
    expect(textContent(bq(p("nested")))).toBe("nested");
  });

  test("hr and space filtered out", () => {
    expect(textContent([hr(), space(), p("a")])).toBe("a");
  });

  test("section node", () => {
    const root = buildSectionTree([h(1, "Title"), p("Intro"), h(2, "Sub"), p("Body")]);
    expect(textContent(root)).toBe("Title\nIntro\nSub\nBody");
  });
});

describe("toMarkdown", () => {
  test("heading", () => {
    expect(toMarkdown([h(2, "A")])).toBe("## A");
  });

  test("code with lang and meta", () => {
    expect(toMarkdown([code("x", "ts", "foo")])).toBe("```ts foo\nx\n```");
  });

  test("blockquote multi", () => {
    expect(toMarkdown([bq(p("A"), p("B"))])).toBe("> A\n\n> B");
  });

  test("ordered list with start", () => {
    expect(toMarkdown([oli(3, liItem(p("a")), liItem(p("b")))])).toBe("3. a\n4. b");
  });

  test("roundtrip parse toMarkdown parse", () => {
    const md = "# A\n\npara\n\n```ts\ncode\n```";
    const { parseBlocks } = require("./tree");
    const nodes = parseBlocks(md);
    const out = toMarkdown(nodes);
    const reparsed = parseBlocks(out);
    expect(reparsed.some((n: any) => n.type === "heading")).toBe(true);
    expect(reparsed.some((n: any) => n.type === "paragraph")).toBe(true);
    expect(reparsed.some((n: any) => n.type === "code")).toBe(true);
  });

  test("section node flattens", () => {
    const root = buildSectionTree([h(1, "A"), p("B")]);
    expect(toMarkdown(root)).toBe("# A\n\nB");
  });
});

describe("flatten", () => {
  test("flattens nested sections", () => {
    const root = buildSectionTree([h(1, "A"), p("B"), h(2, "C"), p("D")]);
    const flat = flatten(root);
    expect(flat.map((n) => n.type)).toEqual(["heading", "paragraph", "heading", "paragraph"]);
  });

  test("root with no headings returns content only", () => {
    const root = buildSectionTree([p("A"), p("B")]);
    const flat = flatten(root);
    expect(flat.map((n) => n.type)).toEqual(["paragraph", "paragraph"]);
  });
});
