// Minimal runtime primitives for feature validators (no validation dependency).
export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function isString(value: unknown): value is string {
  return typeof value === "string";
}

export function isNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

export function isOptional<T>(
  value: unknown,
  check: (v: unknown) => v is T
): value is T | undefined {
  return value === undefined || check(value);
}

// Prisma/SQLite return null (not undefined) for unset optional columns,
// and JSON round-trips preserve it — accept both.
export function isNullable<T>(
  value: unknown,
  check: (v: unknown) => v is T
): value is T | null | undefined {
  return value === undefined || value === null || check(value);
}
