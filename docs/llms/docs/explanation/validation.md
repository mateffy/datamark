

import { Callout } from 'fumadocs-ui/components/callout';

datamark does not bundle a validator. Instead, it implements the **Standard Schema v1** interface, a cross-library specification that Zod, Valibot, ArkType, TypeBox, and others support.

Standard Schema v1 [#standard-schema-v1]

Any object with a `~standard` property implementing the spec can be passed as a schema:

```typescript
import * as z from "zod";
import { datamark } from "datamark";

const MyFormat = datamark({
  schema: z.object({ name: z.string(), age: z.number() }),
  *parse(doc) {
    // ...
    return { name: "Ada", age: 30 };
  },
});

const result = MyFormat.parse(markdown);
// result is typed as { name: string; age: number }
```

Validation in the parse pipeline [#validation-in-the-parse-pipeline]

When a schema is provided, `parse()` validates the generator's return value automatically. If validation fails, it throws `ValidationError` with structured issue data:

```typescript
try {
  MyFormat.parse(badMarkdown);
} catch (err) {
  if (err instanceof ValidationError) {
    console.log(err.issues);
    // [{ message: "Expected string, received number", path: ["age"] }]
  }
}
```

<Callout type="warn">
  Asynchronous schema validation is not supported. Use synchronous validators like Zod or Valibot.
</Callout>

Supported validators [#supported-validators]

| Library | Status                   |
| ------- | ------------------------ |
| Zod     | ✅ Supported              |
| Valibot | ✅ Supported              |
| ArkType | ✅ Supported              |
| TypeBox | ✅ Supported              |
| Yup     | ❌ Not Standard Schema v1 |
| Joi     | ❌ Not Standard Schema v1 |
