import { inlineText, textContent, flatten } from "../src/parse";
import { toMarkdown } from "../src/stringify";
import { sampleDoc } from "./parse-and-stringify";

export const fullBodyText = textContent(sampleDoc.root);

export const flatBlocks = flatten(sampleDoc.root);
export const serialized = toMarkdown(flatBlocks);
