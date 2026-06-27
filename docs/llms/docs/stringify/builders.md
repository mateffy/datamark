

import { Callout } from 'fumadocs-ui/components/callout';

The `datamark/stringify` subpath exports builder primitives — pure functions that take data and return Markdown strings. Use them instead of raw string concatenation to keep serialization readable, type-safe, and free of escaping bugs.

<Callout type="info">
  All builders are pure functions. They return strings, not AST nodes. Compose them with `join("\n\n")` or template literals.
</Callout>

Block builders [#block-builders]

frontmatter(data) [#frontmatterdata]

Build a YAML frontmatter fence from a data object.

```typescript
import { frontmatter } from "datamark/stringify";

frontmatter({ title: "Hello", tags: ["a", "b"] })
// "---\ntitle: Hello\ntags:\n  - a\n  - b\n---\n"
```

heading(text, depth?) [#headingtext-depth]

Build a Markdown heading. Depth defaults to `1` and is clamped to `1–6`.

```typescript
import { heading } from "datamark/stringify";

heading("Title")       // "# Title"
heading("Subtitle", 2) // "## Subtitle"
```

paragraph(text) [#paragraphtext]

Build a paragraph. Returns the text as-is.

```typescript
import { paragraph } from "datamark/stringify";

paragraph("This is a paragraph.") // "This is a paragraph."
```

codeBlock(code, lang?) [#codeblockcode-lang]

Build a fenced code block.

````typescript
import { codeBlock } from "datamark/stringify";

codeBlock("const x = 1;", "typescript")
// "```typescript\nconst x = 1;\n```"
````

list(items, ordered?, start?) [#listitems-ordered-start]

Build a list from an array of item strings.

```typescript
import { list } from "datamark/stringify";

list(["First", "Second"])      // "- First\n- Second"
list(["A", "B"], true)         // "1. A\n2. B"
list(["C", "D"], true, 3)      // "3. C\n4. D"
```

Multi-line items are indented correctly:

```typescript
import { list } from "datamark/stringify";

list(["First line\nSecond line", "Another"])
// "- First line\n  Second line\n- Another"
```

blockquote(text) [#blockquotetext]

Build a blockquote.

```typescript
import { blockquote } from "datamark/stringify";

blockquote("A wise quote.")
// "> A wise quote."
```

Multi-line text gets a `> ` prefix on every line:

```typescript
import { blockquote } from "datamark/stringify";

blockquote("Line one\nLine two")
// "> Line one\n> Line two"
```

horizontalRule() [#horizontalrule]

Build a horizontal rule.

```typescript
import { horizontalRule } from "datamark/stringify";

horizontalRule() // "---"
```

Inline builders [#inline-builders]

strong(text) [#strongtext]

Wrap text in bold.

```typescript
import { strong } from "datamark/stringify";

strong("bold") // "**bold**"
```

em(text) [#emtext]

Wrap text in italics.

```typescript
import { em } from "datamark/stringify";

em("italic") // "*italic*"
```

codeSpan(text) [#codespantext]

Wrap text in inline code.

```typescript
import { codeSpan } from "datamark/stringify";

codeSpan("foo") // "`foo`"
```

link(text, href, title?) [#linktext-href-title]

Build a Markdown link.

```typescript
import { link } from "datamark/stringify";

link("Docs", "https://example.com")
// "[Docs](https://example.com)"

link("Docs", "https://example.com", "API Docs")
// "[Docs](https://example.com \"API Docs\")"
```

image(alt, src, title?) [#imagealt-src-title]

Build a Markdown image.

```typescript
import { image } from "datamark/stringify";

image("Logo", "/logo.png")
// "![Logo](/logo.png)"

image("Logo", "/logo.png", "Company logo")
// "![Logo](/logo.png \"Company logo\")"
```

strikethrough(text) [#strikethroughtext]

Build strikethrough text.

```typescript
import { strikethrough } from "datamark/stringify";

strikethrough("deleted") // "~~deleted~~"
```

Composing a full document [#composing-a-full-document]

Builder primitives are pure functions that return strings. Compose them with `Array.join` or template literals:

```typescript
import {
  frontmatter,
  heading,
  paragraph,
  codeBlock,
  list,
  strong,
} from "datamark/stringify";

const markdown = [
  frontmatter({ title: "API Guide", version: "1.0" }),
  heading("Authentication", 2),
  paragraph(`Use ${strong("Bearer tokens")} for all requests.`),
  codeBlock("fetch('/api', { headers: { Authorization: 'Bearer ...' } });", "javascript"),
  heading("Endpoints", 2),
  list(["GET /users", "POST /users", "DELETE /users/:id"]),
].join("\n\n");
```

This produces clean, well-formatted Markdown without manual escaping or fence counting.
