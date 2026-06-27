

import { Callout } from 'fumadocs-ui/components/callout';

When you call `parse(content)` on a Markdown string, datamark produces a `Document` — a fully typed tree of nodes that mirrors the structure of the original text.

Document [#document]

```typescript
interface Document {
  type: "document";
  frontmatter: Record<string, unknown> | null;
  root: SectionNode;
}
```

* `frontmatter` — parsed YAML from `---` fences, or `null`
* `root` — the root section of the document tree

Section tree [#section-tree]

The `root` is a `SectionNode` that organizes the entire document by heading depth:

```typescript
interface SectionNode {
  type: "section";
  heading: HeadingNode | null;
  children: Node[];
}
```

Headings become section boundaries. A section contains its heading (if any) and all content until the next heading of the same or lesser depth. The algorithm is single-pass, stack-based, and depth-agnostic — any heading depth works.

```typescript
import { parse } from "datamark";

const doc = parse(`
# Title

Intro paragraph.

## Section A

Some text.

### Subsection A1

More text.

## Section B

Final text.
`);

// Section tree navigation
const topSection = doc.root.children.find(
  (n) => n.type === "section"
) as any;

const topSectionDepth = topSection?.heading?.depth;
const subSections = topSection?.children?.filter(
  (n: any) => n.type === "section"
);
const subSubSections = subSections?.[0]?.children?.filter(
  (n: any) => n.type === "section"
);
const subSubDepth = subSubSections?.[0]?.heading?.depth;

// Node example
const paraDoc = parse(`# Hello\n\nThis is a **paragraph**.`);
const firstSection = paraDoc.root.children[0] as any;
const firstSectionType = firstSection.type;
const firstSectionHeadingDepth = firstSection.heading.depth;
const firstParagraph = firstSection.children.find(
  (n: any) => n.type === "paragraph"
);
const firstSectionChildType = firstParagraph?.type ?? "none";
```

<Callout type="info">
  Content before the first heading stays in `root.children`. If there are no headings at all, the entire document is in `root.children`.
</Callout>

Node hierarchy [#node-hierarchy]

All nodes share a common base:

```typescript
interface Node {
  type: string;
  raw?: string;
  position?: SourceSpan;
}

interface ParentNode extends Node {
  children: Node[];
}
```

Block nodes [#block-nodes]

| Type         | Interface        | Key properties                                    |
| ------------ | ---------------- | ------------------------------------------------- |
| `heading`    | `HeadingNode`    | `depth: number`, `children: InlineNode[]`         |
| `paragraph`  | `ParagraphNode`  | `children: InlineNode[]`                          |
| `code`       | `CodeNode`       | `lang?: string`, `meta?: string`, `value: string` |
| `blockquote` | `BlockquoteNode` | `children: BlockNode[]`                           |
| `hr`         | `HrNode`         | —                                                 |
| `list`       | `ListNode`       | `ordered: boolean`, `children: ListItemNode[]`    |
| `listItem`   | `ListItemNode`   | `children: BlockNode[]`                           |
| `table`      | `TableNode`      | `children: TableRowNode[]`, `align`               |
| `tableRow`   | `TableRowNode`   | `children: TableCellNode[]`                       |
| `tableCell`  | `TableCellNode`  | `children: InlineNode[]`                          |
| `html`       | `HtmlBlockNode`  | `value: string`                                   |
| `space`      | `SpaceNode`      | —                                                 |

Inline nodes [#inline-nodes]

| Type       | Interface      | Key properties                   |
| ---------- | -------------- | -------------------------------- |
| `text`     | `TextNode`     | `value: string`                  |
| `escape`   | `EscapeNode`   | `value: string`                  |
| `strong`   | `StrongNode`   | `children: InlineNode[]`         |
| `em`       | `EmNode`       | `children: InlineNode[]`         |
| `codespan` | `CodeSpanNode` | `value: string`                  |
| `link`     | `LinkNode`     | `href: string`, `title?: string` |
| `image`    | `ImageNode`    | `src: string`, `alt: string`     |
| `br`       | `BreakNode`    | —                                |
| `del`      | `DelNode`      | `children: InlineNode[]`         |

Positions [#positions]

Every node carries an optional `position` with start and end line/column:

```typescript
interface SourceSpan {
  start: { line: number; column: number; offset: number };
  end: { line: number; column: number; offset: number };
}
```

<Callout type="info">
  Positions are computed relative to the original input string, even when frontmatter is stripped. This means errors and traces point to the right place in your source file.
</Callout>

Example [#example]

```typescript
import { parse } from "datamark";

const doc = parse(`# Hello\n\nThis is a **paragraph**.`);
const topSection = doc.root.children[0] as any;
const paragraph = topSection.children.find((n: any) => n.type === "paragraph");
console.log(topSection.type);        // "section"
console.log(topSection.heading.depth); // 1
console.log(paragraph.type);           // "paragraph"
```
