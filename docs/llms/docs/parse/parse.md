

import { Callout } from 'fumadocs-ui/components/callout';

parse(content) [#parsecontent]

Parses a Markdown string into a fully typed `Document` with a section tree.

````typescript
import { parse, stringify } from "datamark";
import { parseBlocks, parseBody, buildSectionTree } from "datamark/parse";

const sampleDoc = parse(`# Hello

This is a paragraph.

\`\`\`typescript
const x = 1;
\`\`\`

## Subheading

More content.`);

const sampleBlocks = parseBlocks("# Title\n\nParagraph\n\n```\ncode\n```");

const sampleBody = parseBody("# Title\n\nParagraph");
````

```typescript
import { parse } from "datamark";

const doc = parse(`
---
title: Hello
---

# Hello World

This is the first paragraph.

## Section

More content here.
`);

console.log(doc.frontmatter); // { title: "Hello" }
console.log(doc.root.type); // "section"
```

What parse() returns [#what-parse-returns]

* **frontmatter**: Parsed YAML from `---` fences, or `null` if absent
* **root**: A `SectionNode` containing the entire document tree

The section tree is built automatically. Headings become boundaries, and all content is organized by depth. See [The AST](/docs/explanation/ast) for details.

Low-level parsing [#low-level-parsing]

If you need the flat block nodes without the section tree, use `parseBlocks()`:

```typescript
import { parseBlocks } from "datamark/parse";

const blocks = parseBlocks("# Hello\n\nParagraph");
// BlockNode[] — flat array, no section tree
```

<Callout type="info">
  `parseBlocks` is also available as `parseBody` for backwards compatibility.
</Callout>
