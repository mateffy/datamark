import { isTodoItem, extractTodoItems } from "../src/parse";
import { parse } from "../src/index";

export const todoDoc = parse(`# Tasks

- [x] Done item
- [ ] Pending item
- [x] Another done`);

export const todos = extractTodoItems(todoDoc.root);

// Find the first list node in the document for isTodoItem check
function findFirstList(node: any): any {
  if (node.type === "list") return node;
  if (node.children) {
    for (const child of node.children) {
      const found = findFirstList(child);
      if (found) return found;
    }
  }
  return null;
}

export const firstList = findFirstList(todoDoc.root);
export const firstIsTodo = firstList ? isTodoItem(firstList) : false;
