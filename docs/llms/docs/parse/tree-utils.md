

import { Callout } from 'fumadocs-ui/components/callout';

The `tree-utils` module provides utilities for working with the AST. Most functions operate on `Node` and recurse into the entire tree automatically.

find / findAll [#find--findall]

Find the first or all nodes matching a predicate anywhere in the tree:

```typescript
import { find, findAll, isHeading } from "datamark/parse";

const firstH2 = find(doc.root, (n) => isHeading(n, 2));
const allCodeBlocks = findAll(doc.root, (n) => n.type === "code");
```

filter [#filter]

Top-level filter on a `Node[]` array (does not recurse):

```typescript
import { filter } from "datamark/parse";

const paragraphs = filter(doc.root.children, (n) => n.type === "paragraph");
```

sectionsAtDepth / sectionsByHeading [#sectionsatdepth--sectionsbyheading]

Find sections by depth or heading text:

```typescript
import { sectionsAtDepth, sectionsByHeading } from "datamark/parse";

const h2s = sectionsAtDepth(doc.root, 2);
const introSection = sectionsByHeading(doc.root, "Introduction");
```

splitBy [#splitby]

Split a flat array of block nodes by a predicate. Separator nodes are discarded:

```typescript
import { splitBy, isHeading } from "datamark/parse";

const groups = splitBy(flatBlocks, (n) => isHeading(n, 2));
// BlockNode[][] — each group is nodes between H2s
```

between / after / before [#between--after--before]

```typescript
import { between, after, before } from "datamark/parse";

const intro = between(flatBlocks, isHeading(1), isHeading(2));
const rest = after(flatBlocks, (n) => isHeading(n, 1));
const preamble = before(flatBlocks, (n) => isHeading(n, 1));
```

codeBlocks [#codeblocks]

Extract all code blocks recursively from any node:

```typescript
import { codeBlocks } from "datamark/parse";

const blocks = codeBlocks(doc.root);
// CodeNode[]
```

textContent / inlineText [#textcontent--inlinetext]

Extract plain text from nodes:

```typescript
import { textContent, inlineText } from "datamark/parse";

const bodyText = textContent(doc.root); // from any Node
const linkLabel = inlineText(linkNode.children); // from InlineNode[]
```

toMarkdown [#tomarkdown]

Serialize nodes back to a Markdown string:

```typescript
import { toMarkdown } from "datamark/stringify";

const markdown = toMarkdown(doc.root); // from SectionNode
const markdown2 = toMarkdown(blocks); // from BlockNode[]
```

<Callout type="info">
  `toMarkdown` is the reverse of parsing. It handles headings, paragraphs, code blocks, lists, blockquotes, tables, and inline formatting.
</Callout>

flatten [#flatten]

Convert a section tree back to a flat array of block nodes:

```typescript
import { flatten } from "datamark/parse";

const blocks = flatten(doc.root);
// BlockNode[]
```

isHeading / isCodeBlock / isTodoItem [#isheading--iscodeblock--istodoitem]

Type guards for common node types:

```typescript
import { isHeading, isCodeBlock, isTodoItem, extractTodoItems } from "datamark/parse";

if (isHeading(node, 1)) { /* ... */ }
if (isCodeBlock(node, "typescript")) { /* ... */ }
if (isTodoItem(node)) { /* ... */ }

const todos = extractTodoItems(doc.root);
// [{ text: "Buy milk", completed: false, raw: "[ ] Buy milk" }]
```

Type guards [#type-guards]

```typescript
import { isSection, isBlockNode, isInlineNode, isParentNode } from "datamark/parse";

if (isSection(node)) {
  console.log(node.heading?.depth);
}

if (isParentNode(node)) {
  console.log(node.children.length);
}
```
