import { datamark } from "../src/index";
import { inlineText } from "../src/parse";
import { heading, paragraph } from "../src/stringify";
import * as z from "zod";

export const NoteSchema = z.object({ title: z.string(), body: z.string() });

export const NoteFormat = datamark({
  schema: NoteSchema,
  parse(doc) {
    const h1 = doc.root.children.find((n) => n.type === "section") as any;
    const title = h1 ? inlineText(h1.heading.children) : "";
    const firstPara = h1?.children?.find((n: any) => n.type === "paragraph");
    const body = firstPara ? inlineText(firstPara.children) : "";
    return { title, body };
  },
  stringify(data) {
    return heading(data.title) + "\n\n" + paragraph(data.body) + "\n";
  },
});
