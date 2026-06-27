import { sectionsAtDepth, sectionsByHeading, splitBy, between, after, before, flatten, isHeading } from "../src/parse";
import { sampleDoc } from "./parse-and-stringify";

export const h2Sections = sectionsAtDepth(sampleDoc.root, 2);

export const subSection = sectionsByHeading(sampleDoc.root, "Subheading");

export const flatBlocks = flatten(sampleDoc.root);
export const groups = splitBy(flatBlocks, (n) => isHeading(n, 2));
export const afterH1 = after(flatBlocks, (n) => isHeading(n, 1));
export const beforeFirstH2 = before(flatBlocks, (n) => isHeading(n, 2));
