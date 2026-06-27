import { validateData, ValidationError } from "../src/parse";

function mockSchema(
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

export const successSchema = mockSchema((data) => {
  if (data && typeof data === "object" && "name" in data) return { value: data };
  return { issues: [{ message: "Missing name" }] };
});

export const validResult = validateData(successSchema, { name: "Ada" });

export const failSchema = mockSchema(() => ({
  issues: [{ message: "Always fails" }],
}));
