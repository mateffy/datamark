import { datamark } from "../src/index";
import { findAll, inlineText, textContent, isCodeBlock } from "../src/parse";
import { heading, paragraph, codeBlock } from "../src/stringify";
import * as z from "zod";

export const ApiDocSchema = z.object({
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

export const ApiDocFormat = datamark({
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

export const apiMarkdown = `# GET /users

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
