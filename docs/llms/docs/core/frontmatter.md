

import { Callout } from 'fumadocs-ui/components/callout';

datamark provides two frontmatter extraction functions for cases where you need them standalone.

extractFrontmatter() [#extractfrontmatter]

```typescript
import { extractFrontmatter } from "datamark";

const result = extractFrontmatter(`---\ntitle: Hello\n---\nBody here`);
// { frontmatter: "title: Hello", body: "Body here" }
```

Supports both `---` and `+++` style fences. Returns `null` if no frontmatter is found.

splitFrontmatter() [#splitfrontmatter]

```typescript
import { splitFrontmatter } from "datamark";

const result = splitFrontmatter(`---\ntitle: Hello\n---\nBody here`);
// { frontmatter: "title: Hello", body: "Body here" }
```

More lenient than `extractFrontmatter`. Uses line-by-line scanning and handles missing closing fences gracefully. Always returns an object (frontmatter may be empty string).

<Callout type="info">
  You usually don't need these directly. `parse()` handles frontmatter extraction and YAML parsing automatically.
</Callout>

FrontmatterError [#frontmattererror]

Both functions throw `FrontmatterError` on unexpected issues:

```typescript
import { FrontmatterError } from "datamark";

try {
  extractFrontmatter(badContent);
} catch (err) {
  if (err instanceof FrontmatterError) {
    console.error(err.message);
  }
}
```
