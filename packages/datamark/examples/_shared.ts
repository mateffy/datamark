import { parse } from "../src/index";

export const SAMPLE_MARKDOWN = `---
id: test-123
title: Test Doc
---

# Hello

This is a **bold** paragraph.

\`\`\`typescript
const x = 1;
\`\`\`

## Section 1

- Item 1
- Item 2

## Section 2

Some more text.
`;

export const SAMPLE_DOC = parse(SAMPLE_MARKDOWN);

export function mockSchema(
  validator: (data: unknown) => { value?: unknown; issues?: { message: string }[] }
) {
  return {
    "~standard": {
      version: 1 as const,
      vendor: "mock",
      validate: validator,
    },
  };
}
