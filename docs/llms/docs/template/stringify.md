

import { Callout } from 'fumadocs-ui/components/callout';

`stringify` receives your typed data and returns a Markdown string. A good `stringify` function is the inverse of your `parse` function — round-tripping through `parse(stringify(data))` should give you back equivalent data.

Import path [#import-path]

Markdown builder functions live under `datamark/stringify`, separate from the Parse SDK:

```typescript
import {
  heading, paragraph, codeBlock, list, frontmatter
} from "datamark/stringify";
```

This keeps your imports explicit: `datamark` for parsing and AST utilities, `datamark/stringify` for serialization.

```typescript
import {
  frontmatter,
  heading,
  paragraph,
  codeBlock,
  list,
  blockquote,
  horizontalRule,
  strong,
  em,
  codeSpan,
  link,
  image,
  strikethrough,
} from "datamark/stringify";

const fm = frontmatter({ title: "Hello", tags: ["a", "b"] });
const h1 = heading("Title", 1);
const h2 = heading("Subtitle", 2);
const p = paragraph("A paragraph of text.");
const cb = codeBlock("const x = 1;", "typescript");
const bulletList = list(["First", "Second"]);
const orderedList = list(["A", "B"], true);
const quote = blockquote("A wise quote.");
const hr = horizontalRule();
const bold = strong("bold");
const italic = em("italic");
const code = codeSpan("code");
const a = link("text", "https://example.com");
const img = image("alt", "img.png");
const del = strikethrough("deleted");
```

The stringify contract [#the-stringify-contract]

Provide `stringify` in your `FormatConfig`:

```typescript
import { datamark } from "datamark";
import { heading, paragraph } from "datamark/stringify";
import * as z from "zod";

const MyFormat = datamark({
  schema: z.object({ title: z.string(), body: z.string() }),
  parse(doc) {
    const title = doc.root.children.find((n: any) => n.type === "heading")?.children?.[0]?.value ?? "";
    const body = doc.root.children.find((n: any) => n.type === "paragraph")?.children?.[0]?.value ?? "";
    return { title, body };
  },
  stringify(data) {
    return heading(data.title) + "\n\n" + paragraph(data.body) + "\n";
  },
});
```

<Callout type="warning">
  `stringify()` throws at runtime if your format was created without a `stringify` function.
</Callout>

Markdown primitives [#markdown-primitives]

Manual string interpolation is fragile. datamark provides typed builder functions that handle escaping, indentation, and formatting correctly.

Frontmatter [#frontmatter]

```typescript
import { frontmatter } from "datamark/stringify";

frontmatter({ title: "Hello", tags: ["a", "b"] });
// "---\ntitle: Hello\ntags:\n  - a\n  - b\n---\n"
```

Uses `stringifyYaml` internally, so complex nested objects work too.

Headings [#headings]

```typescript
import { heading } from "datamark/stringify";

heading("Title", 1)     // "# Title"
heading("Subtitle", 2)  // "## Subtitle"
```

Depth is clamped to `1–6` automatically.

Code blocks [#code-blocks]

````typescript
import { codeBlock } from "datamark/stringify";

codeBlock("const x = 1;", "typescript")
// "```typescript\nconst x = 1;\n```"
````

Lists [#lists]

```typescript
import { list } from "datamark/stringify";

list(["First", "Second"])              // "- First\n- Second"
list(["A", "B"], true)                 // "1. A\n2. B"
list(["A", "B"], true, 5)              // "5. A\n6. B"
```

Multi-line items are indented correctly.

Blockquotes [#blockquotes]

```typescript
import { blockquote } from "datamark/stringify";

blockquote("line1\nline2")
// "> line1\n> line2"
```

Inline formatting [#inline-formatting]

```typescript
import {
  strong,
  em,
  codeSpan,
  link,
  image,
  strikethrough,
} from "datamark/stringify";

strong("bold")              // "**bold**"
em("italic")                // "*italic*"
codeSpan("code")            // "`code`"
link("text", "https://...") // "[text](https://...)"
image("alt", "img.png")     // "![alt](img.png)"
strikethrough("deleted")    // "~~deleted~~"
```

Building a full document [#building-a-full-document]

Combine primitives to build a complete document:

```typescript
import { datamark } from "datamark";
import { inlineText } from "datamark/parse";
import { heading, paragraph } from "datamark/stringify";
import * as z from "zod";

const NoteSchema = z.object({ title: z.string(), body: z.string() });

const NoteFormat = datamark({
  schema: NoteSchema,
  parse(doc) {
    const h1 = doc.root.children.find((n) => n.type === "section") as any;
    const title = h1 ? inlineText(h1.heading.children) : "";
    const firstPara = h1?.children?.find((n: any) => n.type === "paragraph");
    const body = firstPara ? inlineText(firstPara.children) : "";
    return { title, body };
  },
  stringify(data) {
    return heading(data.title) + "\n\n" + paragraph(data.body) + "\n";
  },
});
```

```typescript
const data = NoteFormat.parse("# Hello\n\nWorld");
const md = NoteFormat.stringify(data);
// "# Hello\n\nWorld\n"
```

Round-trip fidelity [#round-trip-fidelity]

For perfect round-tripping, your `parse` and `stringify` should be inverses:

```typescript
const data = NoteFormat.parse("# Hello\n\nWorld");
const roundTrip = NoteFormat.parse(NoteFormat.stringify(data));
// data and roundTrip should be deep-equal
```

Markdown is lossy by design — `parse` normalizes whitespace and `stringify` may emit slightly different formatting. If exact round-tripping is required, store the original Markdown alongside the parsed data.
