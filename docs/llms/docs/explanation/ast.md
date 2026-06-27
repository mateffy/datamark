

import { Callout } from 'fumadocs-ui/components/callout';

When you call `parse(content)` on a Markdown string, datamark produces a `Document` — a fully typed tree of nodes that mirrors the structure of the original text.

Document [#document]

```typescript
interface Document {
  type: "document";
  frontmatter: Record<string, unknown> | null;
  children: BlockNode[];
}
```

* `frontmatter` — parsed YAML from `---` fences, or `null`
* `children` — array of top-level block nodes

Block nodes [#block-nodes]

| Type         | Interface        | Key properties                                    |
| ------------ | ---------------- | ------------------------------------------------- |
| `heading`    | `HeadingNode`    | `depth: number`, `children: InlineNode[]`         |
| `paragraph`  | `ParagraphNode`  | `children: InlineNode[]`                          |
| `code`       | `CodeNode`       | `lang?: string`, `meta?: string`, `value: string` |
| `blockquote` | `BlockquoteNode` | `children: BlockNode[]`                           |
| `hr`         | `HrNode`         | —                                                 |
| `list`       | `ListNode`       | `ordered: boolean`, `items: BlockNode[][]`        |
| `table`      | `TableNode`      | `header`, `rows`, `align`                         |
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
console.log(doc.children[0].type); // "heading"
console.log(doc.children[0].depth); // 1
console.log(doc.children[1].type); // "paragraph"
```
