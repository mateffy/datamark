import { find, findAll, filter, isHeading, isCodeBlock } from "../src/parse";
import { sampleDoc } from "./parse-and-stringify";

export const firstH1 = find(sampleDoc.root, (n) => isHeading(n, 1));

export const allHeadings = findAll(sampleDoc.root, (n) => n.type === "heading");

export const allCodeBlocks = findAll(sampleDoc.root, (n) => isCodeBlock(n, "typescript"));

export const paragraphs = filter(sampleDoc.root.children, (n) => n.type === "paragraph");
