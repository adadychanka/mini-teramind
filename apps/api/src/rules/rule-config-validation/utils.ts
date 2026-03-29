import { ValidationError } from 'class-validator';

/**
 * Flattens validation errors into a single array of error messages.
 * @param errors - The validation errors to flatten.
 * @returns An array of error messages.
 */
export function flattenValidationErrors(errors: ValidationError[]): string[] {
  return errors.flatMap((error) => {
    const parentConstraints = Object.values(error.constraints ?? {});

    const childConstraints =
      error.children?.flatMap((child) => {
        return Object.values(child.constraints ?? []);
      }) ?? [];

    return [...parentConstraints, ...childConstraints];
  });
}
