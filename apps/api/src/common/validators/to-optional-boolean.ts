/**
 * Coerce a value to an optional boolean.
 * Query params are strings; coerce before @IsBoolean().
 * @param value - The value to coerce
 * @returns The coerced value, or undefined if the value is undefined, null, or an empty string
 */
export function toOptionalBoolean(value: unknown): boolean | undefined {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }
  if (value === true || value === 'true') {
    return true;
  }
  if (value === false || value === 'false') {
    return false;
  }
  return value as boolean | undefined;
}
