

import { Card, Cards } from 'fumadocs-ui/components/card';
import { Callout } from 'fumadocs-ui/components/callout';

datamark is a TypeScript library for turning Markdown documents into typed objects — and back again. It gives you a **unified AST** with a native section tree, plus a lightweight **format system** for defining how documents map to your data structures.

<Cards>
  <Card title="Parse SDK" description="Parse documents, extract frontmatter, query the AST" href="/docs/parse" />

  <Card title="Stringify SDK" description="Serialize AST nodes and build Markdown with typed primitives" href="/docs/stringify" />

  <Card title="Format SDK" description="Define bidirectional formats with datamark()" href="/docs/template" />

  <Card title="Examples" description="Real-world format definitions for common patterns" href="/docs/examples" />
</Cards>

Why datamark? [#why-datamark]

Markdown is the universal format for structured text, but parsing it into typed data usually means one of two things:

1. **Regex and string manipulation** — fragile, unreadable, unmaintainable.
2. **Abstract syntax trees** — powerful, but you still write imperative traversal code.

datamark gives you a third option: **a unified AST with a native section tree** and **a lightweight format system** that makes common patterns trivial.

<Callout type="info">
  **Bring your own validator.** datamark uses the Standard Schema v1 interface, so Zod, Valibot, ArkType, TypeBox, and any compliant library work out of the box.
</Callout>

A 10-second demo [#a-10-second-demo]

```typescript
import { datamark } from "datamark";
import { findAll, inlineText, textContent, isCodeBlock } from "datamark/parse";
import { frontmatter, heading, paragraph, codeBlock } from "datamark/stringify";
import * as z from "zod";

const PlanFrontmatterSchema = z.object({ id: z.string() });

const PlanSchema = z.object({
  id: z.string(),
  title: z.string(),
  steps: z.array(
    z.object({
      description: z.string(),
      scripts: z.array(z.string()),
    })
  ),
});

const PlanFormat = datamark({
  frontmatterSchema: PlanFrontmatterSchema,
  schema: PlanSchema,

  parse(doc) {
    const id = doc.frontmatter.id;
    const titleSection = doc.root.children.find((n) => n.type === "section") as any;
    const title = titleSection ? inlineText(titleSection.heading.children) : "";

    const steps = titleSection
      ? (titleSection.children.filter((n: any) => n.type === "section") as any[]).map(
          (section) => {
            const scripts = findAll(section, (n) => isCodeBlock(n, "javascript")).map(
              (n: any) => n.value
            );
            const description = textContent(section).trim();
            return { description, scripts };
          }
        )
      : [];

    return { id, title, steps };
  },

  stringify(data) {
    let md = frontmatter({ id: data.id }) + heading(data.title) + "\n\n";
    for (const step of data.steps) {
      md += heading("Step", 2) + "\n\n" + paragraph(step.description) + "\n\n";
      for (const script of step.scripts) {
        md += codeBlock(script, "javascript") + "\n\n";
      }
    }
    return md;
  },
});

const planMarkdown = `---
id: plan-001
---
# Q3 Roadmap

## Step

Set up the project.

\`\`\`javascript
npm init -y
\`\`\`

## Step

Implement the core features.`;
```

```typescript
const result = PlanFormat.parse(planMarkdown);
console.log(result.id);     // "plan-001"
console.log(result.title);  // "Q3 Roadmap"
```

What datamark is NOT [#what-datamark-is-not]

<Callout type="warn">
  **It is not a static site generator.** It parses and transforms Markdown, but it does not build HTML pages or apply themes.
</Callout>

* **It is not a Markdown renderer.** It produces data, not HTML.
* **It does not stream.** Input string in, typed object out.
* **It is not a general-purpose parser generator.** It is specifically designed for Markdown documents.

Who is it for? [#who-is-it-for]

<Cards>
  <Card title="CLI & Script Developers" description="Parse READMEs, changelogs, plan files, and API docs into structured data for automation, validation, and CI." />

  <Card title="Application Developers" description="Embed typed Markdown parsing into your app for user-generated content, configuration files, and documentation formats." />
</Cards>

Quick navigation [#quick-navigation]

| Goal                        | Section                          |
| --------------------------- | -------------------------------- |
| New here?                   | [Quickstart](/docs/quickstart)   |
| Understand the architecture | [The AST](/docs/explanation/ast) |
| Look up a function          | [Parse SDK](/docs/parse)         |
| See real formats            | [Examples](/docs/examples)       |
| Compare to alternatives     | [Comparisons](/compare)          |
