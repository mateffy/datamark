import { describe, test, expect } from "bun:test";
import {
  validateData,
  ValidationError,
  type StandardSchemaV1,
} from "./validation";

function createMockSchema(
  validator: (data: unknown) => {
    value?: unknown;
    issues?: { message: string }[];
  }
) {
  return {
    "~standard": {
      version: 1 as const,
      vendor: "mock",
      validate: validator,
    },
  };
}

describe("validateData", () => {
  test("success returns correct value", () => {
    const schema = createMockSchema((data) => ({ value: data }));
    expect(validateData(schema, { foo: "bar" })).toEqual({ foo: "bar" });
  });

  test("failure throws ValidationError with issues", () => {
    const schema = createMockSchema(() => ({
      issues: [{ message: "Invalid" }],
    }));
    expect(() => validateData(schema, {})).toThrow(ValidationError);
    try {
      validateData(schema, {});
    } catch (err) {
      expect(err).toBeInstanceOf(ValidationError);
      expect((err as ValidationError).issues).toEqual([{ message: "Invalid" }]);
    }
  });

  test("async schema throws TypeError", () => {
    const schema = {
      "~standard": {
        version: 1 as const,
        vendor: "mock",
        validate: () => Promise.resolve({ value: "ok" }),
      },
    };
    expect(() => validateData(schema, {})).toThrow(TypeError);
  });
});

describe("ValidationError", () => {
  test("has correct name", () => {
    const err = new ValidationError("msg", [{ message: "issue" }]);
    expect(err.name).toBe("ValidationError");
  });

  test("has correct message", () => {
    const err = new ValidationError("test message", []);
    expect(err.message).toBe("test message");
  });

  test("stores issues", () => {
    const issues = [{ message: "issue1" }, { message: "issue2" }];
    const err = new ValidationError("msg", issues);
    expect(err.issues).toEqual(issues);
  });

  test("handles empty issues array", () => {
    const err = new ValidationError("msg", []);
    expect(err.issues).toEqual([]);
  });
});

describe("StandardSchemaV1", () => {
  test("type compliance: mock schema has ~standard property", () => {
    const schema = createMockSchema(() => ({ value: true }));
    expect(schema).toHaveProperty("~standard");
    expect(schema["~standard"].version).toBe(1);
    expect(schema["~standard"].vendor).toBe("mock");
    expect(typeof schema["~standard"].validate).toBe("function");
  });

  test("InferInput type helper exists (compile-time)", () => {
    const schema = createMockSchema(() => ({ value: "hello" }));
    type Input = StandardSchemaV1.InferInput<typeof schema>;
    // Runtime check to satisfy the test runner while types are checked by TS
    const _input: Input = "anything";
    expect(_input).toBe("anything");
  });

  test("InferOutput type helper exists (compile-time)", () => {
    const schema = createMockSchema(() => ({ value: "hello" }));
    type Output = StandardSchemaV1.InferOutput<typeof schema>;
    const _output: Output = "hello";
    expect(_output).toBe("hello");
  });
});
