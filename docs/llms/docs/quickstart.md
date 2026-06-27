

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
    import { datamark, heading, markdown, codeBlock, todoItem, inlineText, textContent, extractTodoItems, splitByCombinator } from "datamark";
    import * as z from "zod";

    const PlanFormat = datamark({
      schema: z.object({
        id: z.string(),
        title: z.string(),
        steps: z.array(z.object({
          title: z.string(),
          description: z.string(),
          scripts: z.array(z.string()),
        })),
      }),

      *parse(doc) {
        const fm = yield* doc.frontmatter();
        const titleNode = yield* doc.consume(heading(1));
        const steps = yield* doc.consume(splitByCombinator(heading(2)), function* (subdoc) {
          const h2 = yield* subdoc.consume(heading(2));
          const body = yield* subdoc.consume(rest());
          const scripts = body
            .filter((n) => n.type === "code")
            .map((n: any) => n.value);
          return {
            title: inlineText(h2.children),
            description: textContent(body),
            scripts,
          };
        });

        return { id: (fm as any)?.id ?? "", title: inlineText(titleNode.children), steps };
      },

      *stringify(doc, data) {
        yield* doc.emitFrontmatter({ id: data.id, title: data.title });
        yield* heading(1, data.title);
        for (const step of data.steps) {
          yield* heading(2, "Step");
          if (step.description) yield* markdown(step.description);
          for (const s of step.scripts) yield* codeBlock("javascript", s);
        }
      },
    });
    ```
  </Step>

  <Step>
    Parse a document [#parse-a-document]

    ````typescript
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
    //     { title: "Set up project scaffolding", description: "Install dependencies.\n\n```javascript\nnpm init -y\n```", scripts: ["npm init -y"] },
    //     { title: "Implement core features", description: "Build the main functionality.", scripts: [] },
    //   ],
    // }
    ````
  </Step>
</Steps>

What happened? [#what-happened]

1. `parse` turned the raw Markdown string into a typed AST.
2. Your `parse` generator consumed that AST step by step using combinators.
3. `doc.consume(splitByCombinator(heading(2)), generator)` split the document into H2-delimited chunks and ran your generator on each one.
4. The final `return` value was validated against your Zod schema.

Where to go next [#where-to-go-next]

| Goal                    | Link                                                  |
| ----------------------- | ----------------------------------------------------- |
| Understand how it works | [Format SDK](/docs/explanation/template-system)       |
| Learn all combinators   | [Parse Combinators](/docs/template/parse-combinators) |
| Look up core functions  | [AST SDK](/docs/core)                                 |
| See more examples       | [Examples](/docs/examples)                            |
