

import { Callout } from 'fumadocs-ui/components/callout';

This example parses API documentation with endpoint info, parameters, and response examples. It combines AST utilities (`findAll`, `isCodeBlock`, `textContent`, `inlineText`) for extraction and stringify primitives (`heading`, `paragraph`, `codeBlock`) for reconstruction.

```typescript
import { datamark } from "datamark";
import { findAll, inlineText, textContent, isCodeBlock } from "datamark/parse";
import { heading, paragraph, codeBlock } from "datamark/stringify";
import * as z from "zod";

const ApiDocSchema = z.object({
  endpoint: z.string(),
  method: z.enum(["GET", "POST", "PUT", "DELETE"]),
  description: z.string(),
  params: z.array(
    z.object({
      name: z.string(),
      type: z.string(),
      required: z.boolean(),
      description: z.string(),
    })
  ),
  response: z.string(),
});

const ApiDocFormat = datamark({
  schema: ApiDocSchema,

  parse(doc) {
    const h1 = doc.root.children.find((n) => n.type === "section") as any;
    const headingText = h1 ? inlineText(h1.heading.children) : "";
    const parts = headingText.split(" ");
    const method = parts[0] as "GET" | "POST" | "PUT" | "DELETE";
    const endpoint = parts[1] ?? "";

    const sections = doc.root.children.filter((n) => n.type === "section") as any[];
    const topSection = sections[0];
    const subSections = topSection
      ? (topSection.children.filter((n: any) => n.type === "section") as any[])
      : [];

    let description = "";
    let response = "";
    let params: any[] = [];

    for (const section of subSections) {
      const sectionHeading = section.heading
        ? inlineText(section.heading.children).toLowerCase()
        : "";

      if (sectionHeading.includes("description")) {
        description = textContent(section).trim();
      }

      if (sectionHeading.includes("parameters")) {
        const paramBlocks = findAll(section, (n) => isCodeBlock(n, "json"));
        for (const block of paramBlocks) {
          try {
            const parsed = JSON.parse((block as any).value);
            params.push(parsed);
          } catch {
            /* ignore */
          }
        }
      }

      if (sectionHeading.includes("response")) {
        const respBlocks = findAll(section, (n) => isCodeBlock(n, "json"));
        if (respBlocks.length > 0) {
          response = (respBlocks[0] as any).value;
        }
      }
    }

    return { endpoint, method, description, params, response };
  },

  stringify(data) {
    let md = heading(`${data.method} ${data.endpoint}`) + "\n\n";
    md += heading("Description", 2) + "\n\n" + paragraph(data.description) + "\n\n";
    if (data.params.length > 0) {
      md += heading("Parameters", 2) + "\n\n";
      for (const p of data.params) {
        md += codeBlock(JSON.stringify(p, null, 2), "json") + "\n\n";
      }
    }
    md += heading("Response", 2) + "\n\n";
    md += codeBlock(data.response, "json") + "\n\n";
    return md;
  },
});

const apiMarkdown = `# GET /users

## Description

Returns a paginated list of users from the database.

## Parameters

\`\`\`json
{ "name": "limit", "type": "number", "required": false, "description": "Maximum number of results" }
\`\`\`

\`\`\`json
{ "name": "offset", "type": "number", "required": false, "description": "Pagination offset" }
\`\`\`

## Response

\`\`\`json
{ "users": [{ "id": 1, "name": "Ada Lovelace" }] }
\`\`\``;
```

```typescript
const result = ApiDocFormat.parse(apiMarkdown);
console.log(result.method); // "GET"
console.log(result.params[0].name); // "limit"
```

Key concepts [#key-concepts]

* **`findAll()`** and **`isCodeBlock()`** from the Parse SDK extract code blocks by language
* **`textContent()`** extracts all text from a section; **`inlineText()`** extracts heading text
* **`codeBlock()`** from `datamark/stringify` serializes JSON back to fenced code blocks
