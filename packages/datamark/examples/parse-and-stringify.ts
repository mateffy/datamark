import { parse, stringify } from "../src/index";
import { parseBlocks, parseBody, buildSectionTree } from "../src/parse";

export const sampleDoc = parse(`# Hello

This is a paragraph.

\`\`\`typescript
const x = 1;
\`\`\`

## Subheading

More content.`);

export const sampleBlocks = parseBlocks("# Title\n\nParagraph\n\n```\ncode\n```");

export const sampleBody = parseBody("# Title\n\nParagraph");
