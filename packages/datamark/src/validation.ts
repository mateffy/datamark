/**
 * Standard Schema v1 interface (vendored from standardschema.dev).
 *
 * This is a copy of the official spec. Keeping it vendored means datamark
 * has zero runtime dependencies — users bring their own validator.
 *
 * Supported validators include Zod, Valibot, ArkType, TypeBox, and any
 * library implementing this interface.
 *
 * @see https://standardschema.dev
 */
export interface StandardSchemaV1<Input = unknown, Output = Input> {
  /** The Standard Schema properties. */
  readonly "~standard": StandardSchemaV1.Props<Input, Output>;
}

export declare namespace StandardSchemaV1 {
  /** The Standard Schema properties interface. */
  export interface Props<Input = unknown, Output = Input> {
    /** The version number of the standard. */
    readonly version: 1;
    /** The vendor name of the schema library. */
    readonly vendor: string;
    /** Validates unknown input values. */
    readonly validate: (
      value: unknown,
      options?: StandardSchemaV1.Options | undefined
    ) => Result<Output> | Promise<Result<Output>>;
    /** Inferred types associated with the schema. */
    readonly types?: Types<Input, Output> | undefined;
  }

  /** The result interface of the validate function. */
  export type Result<Output> = SuccessResult<Output> | FailureResult;

  /** The result interface if validation succeeds. */
  export interface SuccessResult<Output> {
    /** The typed output value. */
    readonly value: Output;
    /** A falsy value for `issues` indicates success. */
    readonly issues?: undefined;
  }

  export interface Options {
    /** Explicit support for additional vendor-specific parameters, if needed. */
    readonly libraryOptions?: Record<string, unknown> | undefined;
  }

  /** The result interface if validation fails. */
  export interface FailureResult {
    /** The issues of failed validation. */
    readonly issues: ReadonlyArray<Issue>;
  }

  /** The issue interface of the failure output. */
  export interface Issue {
    /** The error message of the issue. */
    readonly message: string;
    /** The path of the issue, if any. */
    readonly path?: ReadonlyArray<PropertyKey | PathSegment> | undefined;
  }

  /** The path segment interface of the issue. */
  export interface PathSegment {
    /** The key representing a path segment. */
    readonly key: PropertyKey;
  }

  /** The Standard types interface. */
  export interface Types<Input = unknown, Output = Input> {
    /** The input type of the schema. */
    readonly input: Input;
    /** The output type of the schema. */
    readonly output: Output;
  }

  /** Infers the input type of a Standard Schema. */
  export type InferInput<Schema extends StandardSchemaV1> =
    Schema extends StandardSchemaV1<infer Input> ? Input : never;

  /** Infers the output type of a Standard Schema. */
  export type InferOutput<Schema extends StandardSchemaV1> =
    Schema extends StandardSchemaV1<any, infer Output> ? Output : never;
}

/**
 * Error thrown when Standard Schema validation fails.
 */
export class ValidationError extends Error {
  readonly issues: ReadonlyArray<StandardSchemaV1.Issue>;

  constructor(
    message: string,
    issues: ReadonlyArray<StandardSchemaV1.Issue>
  ) {
    super(message);
    this.name = "ValidationError";
    this.issues = issues;
  }
}

/**
 * Validates an unknown value against a Standard Schema compliant validator.
 *
 * @param schema - Any schema implementing the Standard Schema v1 interface
 * @param data - The unknown data to validate
 * @returns The typed, validated output
 * @throws ValidationError if validation fails
 *
 * @example
 * ```ts
 * import * as z from "zod";
 * import { validateData } from "datamark";
 *
 * const schema = z.object({ name: z.string(), age: z.number() });
 * const data = validateData(schema, { name: "Alice", age: 30 });
 * // data is typed as { name: string; age: number }
 * ```
 */
export function validateData<T extends StandardSchemaV1>(
  schema: T,
  data: unknown
): StandardSchemaV1.InferOutput<T> {
  const result = schema["~standard"].validate(data);

  if (result instanceof Promise) {
    throw new TypeError(
      "Asynchronous schema validation is not supported. " +
        "Use a synchronous validator (e.g. Zod, Valibot, ArkType)."
    );
  }

  if (result.issues) {
    throw new ValidationError(
      `Validation failed with ${result.issues.length} issue(s)`,
      result.issues
    );
  }

  return result.value as StandardSchemaV1.InferOutput<T>;
}

/**
 * Validates frontmatter data against an optional schema.
 * Returns the data as-is when no schema is provided.
 */
export function validateFrontmatter<T>(
  data: Record<string, unknown> | null,
  schema?: StandardSchemaV1<any, T>
): T | null {
  if (data === null) return null;
  if (!schema) return data as T;
  return validateData(schema, data);
}
