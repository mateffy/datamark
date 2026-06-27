

import { Step, Steps } from 'fumadocs-ui/components/steps';
import { Callout } from 'fumadocs-ui/components/callout';

Parse your first Markdown document into a typed object in three steps. About 5 minutes.

<Steps>
  <Step>
    Install [#install]

    ```bash
    npm install datamark
    ```

    For validation, also install your schema library of choice:

    ```bash
    npm install zod
    ```
  </Step>

  <Step>
    Write your first format [#write-your-first-format]

    Create a file that describes how your Markdown is structured:

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
    console.log(result.steps[0].description); // "Set up the project."
    ```
  </Step>

  <Step>
    Parse a document [#parse-a-document]

    ```typescript
    import { PlanFormat } from "./plan-format";

    const markdown = `---
    id: plan-001
    ---
    # Q3 Roadmap

    ## Set up project scaffolding

    Install dependencies.

    \`\`\`javascript
    npm init -y
    \`\`\`

    ## Implement core features

    Build the main functionality.
    `;

    const result = PlanFormat.parse(markdown);
    console.log(result);
    // {
    //   id: "plan-001",
    //   title: "Q3 Roadmap",
    //   steps: [
    //     { title: "Set up project scaffolding", description: "Install dependencies.", scripts: ["npm init -y"] },
    //     { title: "Implement core features", description: "Build the main functionality.", scripts: [] },
    //   ],
    // }
    ```
  </Step>
</Steps>

What happened? [#what-happened]

1. `parse` turned the raw Markdown string into a typed AST with a section tree.
2. Your `parse` function traversed the AST using utility functions like `findAll`, `textContent`, and `isCodeBlock`.
3. The section tree made it easy to iterate over H2-delimited sections.
4. The final return value was validated against your Zod schema.

Where to go next [#where-to-go-next]

| Goal                          | Link                                           |
| ----------------------------- | ---------------------------------------------- |
| Understand how it works       | [The AST](/docs/explanation/ast)               |
| Learn about the format system | [Format SDK](/docs/template/datamark-function) |
| Look up core functions        | [Parse SDK](/docs/parse)                       |
| See more examples             | [Examples](/docs/examples)                     |
