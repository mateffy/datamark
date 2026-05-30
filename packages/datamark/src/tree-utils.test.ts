import { describe, test, expect } from "bun:test";
import {
  isHeading,
  isCodeBlock,
  isTodoItem,
  extractTodoItems,
  find,
  findAll,
  filter,
  sections,
  splitBy,
  between,
  after,
  before,
  codeBlocks,
  inlineText,
  textContent,
  toMarkdown,
} from "./tree-utils";
import type { BlockNode, InlineNode } from "./tree";
import { parseBody } from "./tree";

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

function li(...items: BlockNode[][]): BlockNode {
  const raw = items.map((item) => item.map((n) => (n as any).raw).join("\n")).join("\n");
  return { type: "list", ordered: false, items, raw } as BlockNode;
}

function oli(start: number, ...items: BlockNode[][]): BlockNode {
  const raw = items.map((item, i) => `${start + i}. ${item.map((n) => (n as any).raw).join("\n")}`).join("\n");
  return { type: "list", ordered: true, start, items, raw } as BlockNode;
}

function space(): BlockNode {
  return { type: "space", raw: "\n\n" } as BlockNode;
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
    expect(isTodoItem(li([p("[ ] a")]))).toBe(true);
  });

  test("false for regular list", () => {
    expect(isTodoItem(li([p("normal")]))).toBe(false);
  });

  test("false for blockquote non-todo", () => {
    expect(isTodoItem(bq(p("[ ] a")))).toBe(false);
  });
});

describe("extractTodoItems", () => {
  test("extracts from list", () => {
    const items = extractTodoItems([li([p("[ ] a")], [p("[x] b")])]);
    expect(items).toHaveLength(2);
    expect(items[0]!.completed).toBe(false);
    expect(items[1]!.completed).toBe(true);
  });

  test("extracts from nested blockquote", () => {
    const items = extractTodoItems([bq(li([p("[X] nested")]))]);
    expect(items).toHaveLength(1);
    expect(items[0]!.text).toBe("nested");
  });

  test("empty array returns []", () => {
    expect(extractTodoItems([])).toEqual([]);
  });
});

describe("find", () => {
  const nodes: BlockNode[] = [h(1, "A"), p("B"), bq(h(2, "C"))];

  test("finds top level node", () => {
    expect(find(nodes, (n) => n.type === "paragraph")!.type).toBe("paragraph");
  });

  test("finds nested in blockquote", () => {
    expect(find(nodes, (n) => isHeading(n, 2))!.type).toBe("heading");
  });

  test("not found returns undefined", () => {
    expect(find(nodes, (n) => n.type === "code")).toBeUndefined();
  });
});

describe("findAll", () => {
  test("multiple at top level", () => {
    const nodes: BlockNode[] = [h(1, "A"), h(1, "B"), p("C")];
    const res = findAll(nodes, (n) => n.type === "heading");
    expect(res).toHaveLength(2);
  });

  test("nested in blockquotes", () => {
    const nodes: BlockNode[] = [bq(h(2, "A")), bq(h(2, "B"))];
    const res = findAll(nodes, (n) => isHeading(n, 2));
    expect(res).toHaveLength(2);
  });

  test("none found returns []", () => {
    expect(findAll([p("A")], (n) => n.type === "code")).toEqual([]);
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

describe("sections", () => {
  test("by heading level", () => {
    const nodes: BlockNode[] = [h(2, "A"), p("B"), h(2, "C"), p("D")];
    const secs = sections(nodes, { by: "heading", level: 2 });
    expect(secs).toHaveLength(2);
    expect(secs[0]!.heading!.type).toBe("heading");
    expect(secs[0]!.children).toHaveLength(1);
  });

  test("content before first heading", () => {
    const nodes: BlockNode[] = [p("pre"), h(2, "A"), p("B")];
    const secs = sections(nodes, { by: "heading", level: 2 });
    expect(secs[0]!.heading).toBeNull();
    expect(secs[1]!.heading).not.toBeNull();
  });

  test("no headings returns single section with null heading", () => {
    const secs = sections([p("A")], { by: "heading", level: 1 });
    expect(secs).toHaveLength(1);
    expect(secs[0]!.heading).toBeNull();
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
    const nodes: BlockNode[] = [bq(code("a")), p("b")];
    const res = codeBlocks(nodes);
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
    expect(textContent([h(1, "A")])).toBe("A");
  });

  test("code", () => {
    expect(textContent([code("x")])).toBe("x");
  });

  test("blockquote recursive", () => {
    expect(textContent([bq(p("nested"))])).toBe("nested");
  });

  test("hr and space filtered out", () => {
    expect(textContent([hr(), space(), p("a")])).toBe("a");
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
    expect(toMarkdown([oli(3, [p("a")], [p("b")])])).toBe("3. a\n4. b");
  });

  test("roundtrip parse toMarkdown parse", () => {
    const md = "# A\n\npara\n\n```ts\ncode\n```";
    const nodes = parseBody(md);
    const out = toMarkdown(nodes);
    const reparsed = parseBody(out);
    expect(reparsed.some((n) => n.type === "heading")).toBe(true);
    expect(reparsed.some((n) => n.type === "paragraph")).toBe(true);
    expect(reparsed.some((n) => n.type === "code")).toBe(true);
  });
});
