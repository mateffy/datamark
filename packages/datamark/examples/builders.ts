import {
  frontmatter,
  heading,
  paragraph,
  codeBlock,
  list,
  blockquote,
  horizontalRule,
  strong,
  em,
  codeSpan,
  link,
  image,
  strikethrough,
} from "../src/stringify";

export const fm = frontmatter({ title: "Hello", tags: ["a", "b"] });
export const h1 = heading("Title", 1);
export const h2 = heading("Subtitle", 2);
export const p = paragraph("A paragraph of text.");
export const cb = codeBlock("const x = 1;", "typescript");
export const bulletList = list(["First", "Second"]);
export const orderedList = list(["A", "B"], true);
export const quote = blockquote("A wise quote.");
export const hr = horizontalRule();
export const bold = strong("bold");
export const italic = em("italic");
export const code = codeSpan("code");
export const a = link("text", "https://example.com");
export const img = image("alt", "img.png");
export const del = strikethrough("deleted");
