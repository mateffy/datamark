

import { Card, Cards } from 'fumadocs-ui/components/card';

Deep dives into datamark's architecture, design decisions, and internals. These pages explain why things work the way they do — useful when you want to understand the system beyond just using it.

<Cards>
  <Card title="The AST" description="Typed tree structure: Document, SectionNode, BlockNode, InlineNode, and how the section tree is built" href="/docs/explanation/ast" />

  <Card title="Validation" description="Standard Schema v1 support, how validation integrates with the parse pipeline, and supported validators" href="/docs/explanation/validation" />
</Cards>

Design principles [#design-principles]

* **Zero bundled dependencies** — You bring your own validator (Zod, Valibot, etc.). No lock-in.
* **Unified node type** — `Node` is the base for everything. Sections, blocks, and inlines share the same traversal API.
* **Native section tree** — Headings are section boundaries in the AST, not just block nodes. This makes document navigation natural.
* **Type inference from schemas** — Both `frontmatterSchema` and `schema` infer their output types via the Standard Schema interface. No manual type annotations needed.
* **Validation before execution** — Frontmatter is validated before `parse()` runs. Output is validated after. Your functions never see invalid data.
