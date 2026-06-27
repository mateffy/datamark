// source.config.ts
import { defineConfig, defineDocs } from "fumadocs-mdx/config";

// plugins/remark-example.ts
import { visit } from "unist-util-visit";
import * as fs from "node:fs";
import * as path from "node:path";
var IMPORT_MAP = {
  '"../src/index"': '"datamark"',
  '"../src/parse"': '"datamark/parse"',
  '"../src/stringify"': '"datamark/stringify"',
  '"../src/tree"': '"datamark"',
  '"../src/tree-utils"': '"datamark/parse"',
  '"../src/validation"': '"datamark/parse"',
  '"../src/frontmatter"': '"datamark/parse"',
  '"../src/yaml"': '"datamark/parse"',
  '"../src/document"': '"datamark"',
  '"../src/position"': '"datamark/parse"'
};
function remarkExample() {
  return (tree) => {
    visit(tree, "mdxJsxFlowElement", (node) => {
      if (node.name !== "Example") return;
      const nameAttr = node.attributes.find((a) => a.name === "name");
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
      code = code.replace(
        /import\s+.*\s+from\s+"\.\.\/(?:examples|_shared)"[^]*?;\n?/g,
        ""
      );
      for (const [from, to] of Object.entries(IMPORT_MAP)) {
        code = code.split(from).join(to);
      }
      code = code.replace(/^export\s+/gm, "");
      code = code.replace(/^\n+|\n+$/g, "");
      node.type = "code";
      node.lang = "typescript";
      node.value = code;
      delete node.name;
      delete node.attributes;
      delete node.children;
    });
  };
}

// source.config.ts
var docs = defineDocs({
  dir: "content/docs",
  docs: {
    postprocess: {
      includeProcessedMarkdown: true
    }
  }
});
var blog = defineDocs({
  dir: "content/blog",
  docs: {
    postprocess: {
      includeProcessedMarkdown: true
    }
  }
});
var compare = defineDocs({
  dir: "content/compare",
  docs: {
    postprocess: {
      includeProcessedMarkdown: true
    }
  }
});
var source_config_default = defineConfig({
  mdxOptions: {
    remarkPlugins: [remarkExample]
  }
});
export {
  blog,
  compare,
  source_config_default as default,
  docs
};
