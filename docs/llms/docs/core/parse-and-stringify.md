

import { Callout } from 'fumadocs-ui/components/callout';

The core `parse()` function turns a Markdown string into a typed `Document`. `stringify()` does the reverse. These are low-level building blocks — no validation, no title detection, just raw frontmatter and AST.

parse() [#parse]

```typescript
import { parse } from "datamark";

const doc = parse(content);
```

Returns [#returns]

```typescript
interface Document {
  type: "document";
  frontmatter: Record<string, unknown> | null;
  children: BlockNode[];
}
```

<Callout type="info">
  `parse` does **not** validate the body of the document. It only extracts raw frontmatter and produces the AST. Use the Format SDK for schema-validated body parsing, title extraction, and structured data.
</Callout>

stringify() [#stringify]

```typescript
import { stringify } from "datamark";

const markdown = stringify(doc);
```

Serializes a `Document` back into a Markdown string. Frontmatter is emitted when present. Children are serialized as markdown.
