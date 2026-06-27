import { extractFrontmatter, splitFrontmatter, FrontmatterError } from "../src/parse";

export const extracted = extractFrontmatter(`---
title: Hello
---

# Body`);

export const split = splitFrontmatter(`---
title: Hello
---

# Body`);

export const noFrontmatter = splitFrontmatter("# No frontmatter\n\nBody");
