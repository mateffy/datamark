

```typescript
import { datamark, heading, splitByCombinator, codeBlock, isCodeBlock, inlineText } from "datamark";
import * as z from "zod";

const ApiDocFormat = datamark({
  schema: z.object({
    endpoint: z.string(),
    method: z.enum(["GET", "POST", "PUT", "DELETE"]),
    description: z.string(),
    params: z.array(z.object({
      name: z.string(),
      type: z.string(),
      required: z.boolean(),
      description: z.string(),
    })),
    response: z.string(),
  }),

  *parse(doc) {
    const h1 = yield* doc.consume(heading(1));
    const parts = inlineText(h1.children).split(" ");
    const method = parts[0] as any;
    const endpoint = parts[1] ?? "";

    const sections = yield* doc.consume(splitByCombinator(heading(2)));

    let description = "";
    let response = "";
    let params: any[] = [];

    for (const section of sections) {
      const headingNode = section.find((n: any) => n.type === "heading");
      const headingText = headingNode ? inlineText(headingNode.children).toLowerCase() : "";

      if (headingText.includes("description")) {
        description = section
          .filter((n: any) => n.type === "paragraph")
          .map((n: any) => n.children.map((c: any) => c.value).join(""))
          .join("\n");
      }

      if (headingText.includes("parameters")) {
        const paramBlocks = section.filter((n: any) => isCodeBlock(n, "json"));
        for (const block of paramBlocks) {
          try {
            const parsed = JSON.parse(block.value);
            params.push(parsed);
          } catch { /* ignore */ }
        }
      }

      if (headingText.includes("response")) {
        const respBlock = section.find((n: any) => isCodeBlock(n, "json"));
        response = respBlock?.value ?? "";
      }
    }

    return { endpoint, method, description, params, response };
  },

  *stringify(doc, data) {
    yield* heading(1, `${data.method} ${data.endpoint}`);
    yield* heading(2, "Description");
    yield* markdown(data.description);
    if (data.params.length > 0) {
      yield* heading(2, "Parameters");
      for (const p of data.params) {
        yield* codeBlock("json", JSON.stringify(p, null, 2));
      }
    }
    yield* heading(2, "Response");
    yield* codeBlock("json", data.response);
  },
});
```

Example input [#example-input]

````markdown
# GET /users

## Description

Returns a list of users.

## Parameters

```json
{ "name": "limit", "type": "number", "required": false, "description": "Max results" }
````

Response [#response]

```json
{ "users": [{ "id": 1, "name": "Ada" }] }
```

````

### Example output

```json
{
  "endpoint": "/users",
  "method": "GET",
  "description": "Returns a list of users.",
  "params": [
    { "name": "limit", "type": "number", "required": false, "description": "Max results" }
  ],
  "response": "{ \"users\": [{ \"id\": 1, \"name\": \"Ada\" }] }"
}
````
