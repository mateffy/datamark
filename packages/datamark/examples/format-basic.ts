import { datamark } from "../src/index";
import { inlineText } from "../src/parse";
import * as z from "zod";

export const BasicSchema = z.object({ title: z.string() });

export const BasicFormat = datamark({
  schema: BasicSchema,
  parse(doc) {
    const h1 = doc.root.children.find((n) => n.type === "section") as any;
    return { title: h1 ? inlineText(h1.heading.children) : "" };
  },
});
