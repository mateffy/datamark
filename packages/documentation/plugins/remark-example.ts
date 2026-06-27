import { visit } from "unist-util-visit";
import * as fs from "node:fs";
import * as path from "node:path";

const IMPORT_MAP: Record<string, string> = {
  '"../src/index"': '"datamark"',
  '"../src/parse"': '"datamark/parse"',
  '"../src/stringify"': '"datamark/stringify"',
  '"../src/tree"': '"datamark"',
  '"../src/tree-utils"': '"datamark/parse"',
  '"../src/validation"': '"datamark/parse"',
  '"../src/frontmatter"': '"datamark/parse"',
  '"../src/yaml"': '"datamark/parse"',
  '"../src/document"': '"datamark"',
  '"../src/position"': '"datamark/parse"',
};

export function remarkExample() {
  return (tree: any) => {
    visit(tree, "mdxJsxFlowElement", (node: any) => {
      if (node.name !== "Example") return;

      const nameAttr = node.attributes.find((a: any) => a.name === "name");
      if (!nameAttr) return;
      const name = nameAttr.value;

      const examplesDir = path.resolve(
        process.cwd(),
        "../datamark/examples"
      );
      const filePath = path.join(examplesDir, `${name}.ts`);
      if (!fs.existsSync(filePath)) {
        console.warn(`[remark-example] Example not found: ${filePath}`);
        return;
      }

      let code = fs.readFileSync(filePath, "utf-8");

      // Remove imports from other examples or shared helpers
      code = code.replace(
        /import\s+.*\s+from\s+"\.\.\/(?:examples|_shared)"[^]*?;\n?/g,
        ""
      );

      // Rewrite src imports to package imports
      for (const [from, to] of Object.entries(IMPORT_MAP)) {
        code = code.split(from).join(to);
      }

      // Strip export keywords (docs show code as usage, not a module)
      code = code.replace(/^export\s+/gm, "");

      // Trim leading/trailing blank lines
      code = code.replace(/^\n+|\n+$/g, "");

      // Replace the JSX node with a code block
      node.type = "code";
      node.lang = "typescript";
      node.value = code;
      delete node.name;
      delete node.attributes;
      delete node.children;
    });
  };
}
