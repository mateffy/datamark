

import { Callout } from 'fumadocs-ui/components/callout';

The `tree-utils` module provides utilities for working with `BlockNode[]` arrays. Most functions recurse into blockquotes and list items automatically.

find / findAll [#find--findall]

```typescript
import { find, findAll, isHeading } from "datamark";

const firstH2 = find(nodes, (n) => isHeading(n, 2));
const allCodeBlocks = findAll(nodes, (n) => n.type === "code");
```

filter [#filter]

Top-level filter (does not recurse):

```typescript
import { filter } from "datamark";

const paragraphs = filter(nodes, (n) => n.type === "paragraph");
```

sections [#sections]

Split nodes into sections separated by headings at a given depth:

```typescript
import { sections } from "datamark";

const sections = sections(nodes, { by: "heading", level: 2 });
// [{ heading: HeadingNode | null, children: BlockNode[] }, ...]
```

splitBy [#splitby]

Split nodes by a predicate. Separator nodes are discarded:

```typescript
import { splitBy, isHeading } from "datamark";

const groups = splitBy(nodes, (n) => isHeading(n, 2));
// BlockNode[][] — each group is nodes between H2s
```

between / after / before [#between--after--before]

```typescript
import { between, after, before } from "datamark";

const intro = between(nodes, isHeading(1), isHeading(2));
const rest = after(nodes, (n) => isHeading(n, 1));
const preamble = before(nodes, (n) => isHeading(n, 1));
```

codeBlocks [#codeblocks]

Extract all code blocks recursively:

```typescript
import { codeBlocks } from "datamark";

const blocks = codeBlocks(nodes);
// CodeNode[]
```

textContent / inlineText [#textcontent--inlinetext]

Extract plain text from nodes:

```typescript
import { textContent, inlineText } from "datamark";

const bodyText = textContent(nodes); // from BlockNode[]
const linkLabel = inlineText(linkNode.children); // from InlineNode[]
```

toMarkdown [#tomarkdown]

Serialize block nodes back to a Markdown string:

```typescript
import { toMarkdown } from "datamark";

const markdown = toMarkdown(nodes);
```

<Callout type="info">
  `toMarkdown` is the reverse of parsing. It handles headings, paragraphs, code blocks, lists, blockquotes, tables, and inline formatting.
</Callout>

isHeading / isCodeBlock / isTodoItem [#isheading--iscodeblock--istodoitem]

Type guards for common node types:

```typescript
import { isHeading, isCodeBlock, isTodoItem, extractTodoItems } from "datamark";

if (isHeading(node, 1)) { /* ... */ }
if (isCodeBlock(node, "typescript")) { /* ... */ }
if (isTodoItem(node)) { /* ... */ }

const todos = extractTodoItems(nodes);
// [{ text: "Buy milk", completed: false, raw: "[ ] Buy milk" }]
```
