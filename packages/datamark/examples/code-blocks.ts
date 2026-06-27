import { codeBlocks, isCodeBlock, find } from "../src/parse";
import { sampleDoc } from "./parse-and-stringify";

export const allBlocks = codeBlocks(sampleDoc.root);
export const typescriptBlocks = codeBlocks(sampleDoc.root, { lang: "typescript" });
export const firstCodeNode = find(sampleDoc.root, (n) => n.type === "code");
export const isTypescript = firstCodeNode ? isCodeBlock(firstCodeNode, "typescript") : false;
