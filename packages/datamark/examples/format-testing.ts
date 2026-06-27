import { datamark } from "../src/index";
import { inlineText } from "../src/parse";

export const TestedFormat = datamark({
  examples: [
    { text: "# Hello", data: { title: "Hello" } },
    { text: "# World\n\nbody", data: { title: "World" } },
  ],
  parse(doc) {
    const h1 = doc.root.children.find((n) => n.type === "section") as any;
    return { title: h1 ? inlineText(h1.heading.children) : "" };
  },
});
