import { parse } from "../src/index";

export const doc = parse(`
# Title

Intro paragraph.

## Section A

Some text.

### Subsection A1

More text.

## Section B

Final text.
`);

// Section tree navigation
export const topSection = doc.root.children.find(
  (n) => n.type === "section"
) as any;

export const topSectionDepth = topSection?.heading?.depth;
export const subSections = topSection?.children?.filter(
  (n: any) => n.type === "section"
);
export const subSubSections = subSections?.[0]?.children?.filter(
  (n: any) => n.type === "section"
);
export const subSubDepth = subSubSections?.[0]?.heading?.depth;

// Node example
export const paraDoc = parse(`# Hello\n\nThis is a **paragraph**.`);
export const firstSection = paraDoc.root.children[0] as any;
export const firstSectionType = firstSection.type;
export const firstSectionHeadingDepth = firstSection.heading.depth;
export const firstParagraph = firstSection.children.find(
  (n: any) => n.type === "paragraph"
);
export const firstSectionChildType = firstParagraph?.type ?? "none";
