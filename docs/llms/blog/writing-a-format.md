

import { Step, Steps } from 'fumadocs-ui/components/steps';
import { Callout } from 'fumadocs-ui/components/callout';

This guide walks through creating a format for a simple project plan document.

<Steps>
  <Step>
    Analyze the document structure [#analyze-the-document-structure]

    Here's the Markdown we want to parse:

    ````markdown
    ---
    id: plan-001
    ---
    # Q3 Roadmap

    ## Step

    Set up the project.

    ```javascript
    npm init -y
    ````

    Step [#step]

    Implement the core.

    ````

    We can see:
    - YAML frontmatter with an `id`
    - An H1 title
    - Sections separated by H2 headings
    - Each section has a description (paragraphs) and optional code blocks

    </Step>

    <Step>

    ### Define the schema

    ```typescript
    import * as z from "zod";

    const PlanSchema = z.object({
      id: z.string(),
      title: z.string(),
      steps: z.array(z.object({
        description: z.string(),
        scripts: z.array(z.string()),
      })),
    });
    ````
  </Step>

  <Step>
    Write the parse generator [#write-the-parse-generator]

    ```typescript
    *parse(doc) {
      // 1. Extract frontmatter
      const fm = yield* doc.frontmatter();

      // 2. Extract the H1 title
      const title = yield* doc.consume(heading(1));

      // 3. Split remaining nodes by H2 headings
      const sections = yield* doc.consume(splitByCombinator(heading(2)));

      // 4. Map each section to a step object
      const steps = sections.map((section) => {
        const scripts = section
          .filter((n) => n.type === "code")
          .map((n: any) => n.value);
        const other = section.filter((n) => n.type !== "code");
        const description = other
          .map((n: any) => ("value" in n ? n.value : ""))
          .join("\n")
          .trim();
        return { description, scripts };
      });

      // 5. Return the parsed object
      return {
        id: (fm as any)?.id ?? "",
        title: inlineText(title.children),
        steps,
      };
    }
    ```

    <Callout type="info">
      `splitByCombinator(heading(2))` splits the remaining nodes into groups separated by H2 headings. The H2 nodes themselves are discarded.
    </Callout>
  </Step>

  <Step>
    Write the stringify generator [#write-the-stringify-generator]

    ```typescript
    *stringify(doc, data) {
      yield* doc.emitFrontmatter({ id: data.id, title: data.title });
      yield* heading(1, data.title);
      for (const step of data.steps) {
        yield* heading(2, "Step");
        if (step.description) yield* markdown(step.description);
        for (const s of step.scripts) yield* codeBlock("javascript", s);
      }
    }
    ```
  </Step>

  <Step>
    Add examples and test [#add-examples-and-test]

    ```typescript
    const PlanFormat = datamark({
      schema: PlanSchema,
      examples: [
        {
          text: `---\nid: plan-001\n---\n# Roadmap\n\n## Step\n\nSetup.\n\n\`\`\`js\nnpm init\n\`\`\``,
          data: { id: "plan-001", title: "Roadmap", steps: [{ description: "Setup.", scripts: ["npm init"] }] },
        },
      ],
      parse: planParse,
      stringify: planStringify,
    });

    // Validate
    const result = PlanFormat.test();
    console.assert(result.passed);
    ```
  </Step>
</Steps>

Where to go next [#where-to-go-next]

* Learn more combinators in [Parse Combinators](/docs/template/parse-combinators)
* Understand [validation](/docs/explanation/validation) with Zod and friends
* See [more examples](/docs/examples) for real-world patterns
