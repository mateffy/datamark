import { datamark } from "../src/index";
import { inlineText, textContent } from "../src/parse";
import { heading, paragraph } from "../src/stringify";
import * as z from "zod";

export const BasicSchema = z.object({
  title: z.string(),
  body: z.string(),
});

export const BasicFormat = datamark({
  schema: BasicSchema,

  parse(doc) {
    const h1 = doc.root.children.find((n) => n.type === "section") as any;
    const title = h1 ? inlineText(h1.heading.children) : "";
    // Get body from the first paragraph inside the top section, excluding the heading
    const firstPara = h1?.children?.find((n: any) => n.type === "paragraph");
    const body = firstPara ? inlineText(firstPara.children) : "";
    return { title, body };
  },

  stringify(data) {
    return heading(data.title) + "\n\n" + paragraph(data.body) + "\n";
  },
});

export const basicMarkdown = "# Hello\n\nThis is the body.";
