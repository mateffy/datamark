

import { Callout } from 'fumadocs-ui/components/callout';

datamark uses the `yaml` package internally for frontmatter handling. These helpers are exposed for cases where you need them standalone.

```typescript
import { parseYaml, stringifyYaml, YamlParseError } from "datamark/parse";

const parsed = parseYaml("title: Hello\ntags:\n  - a\n  - b");

const stringified = stringifyYaml({ title: "Hello", tags: ["a", "b"] });

const nestedParsed = parseYaml(`meta:
  author: Ada
  date: 2026-06-01`);
```

parseYaml() [#parseyaml]

```typescript
import { parseYaml } from "datamark/parse";

const data = parseYaml("title: Hello\ntags:\n  - a\n  - b");
// { title: "Hello", tags: ["a", "b"] }
```

stringifyYaml() [#stringifyyaml]

```typescript
import { stringifyYaml } from "datamark/stringify";

const yaml = stringifyYaml({ title: "Hello", tags: ["a", "b"] });
// "title: Hello\ntags:\n  - a\n  - b\n"
```

YamlParseError [#yamlparseerror]

Invalid YAML throws `YamlParseError`:

```typescript
import { YamlParseError } from "datamark/parse";

try {
  parseYaml("not: [valid yaml");
} catch (err) {
  if (err instanceof YamlParseError) {
    console.error(err.message);
  }
}
```

<Callout type="info">
  You usually don't need these directly. `parse()` handles YAML parsing automatically.
</Callout>
