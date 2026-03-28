import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { isDateRangeValid } from './is-date-range-valid';

const IS_DATE_RANGE_VALID_CONSTRAINT_NAME = 'isDateRangeValid';

@ValidatorConstraint({ name: IS_DATE_RANGE_VALID_CONSTRAINT_NAME, async: false })
class IsDateRangeValidConstraint implements ValidatorConstraintInterface {
  validate(_: unknown, validationArguments?: ValidationArguments): Promise<boolean> | boolean {
    const [fromPropertyName, toPropertyName] = validationArguments?.constraints as [string, string];
    const object = validationArguments?.object as Record<string, string | undefined>;

    const from = object[fromPropertyName];
    const to = object[toPropertyName];

    return isDateRangeValid(from, to);
  }
}

/**
 * Decorator to validate if the date range is valid.
 * @param validationOptions - The validation options
 * @returns A decorator function that validates the date range
 */
export function IsDateRangeValid(
  fromPropertyName: string,
  toPropertyName: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName?: string) {
    registerDecorator({
      name: IS_DATE_RANGE_VALID_CONSTRAINT_NAME,
      target: object.constructor,
      propertyName: propertyName ?? '',
      options: validationOptions,
      constraints: [fromPropertyName, toPropertyName],
      validator: IsDateRangeValidConstraint,
    });
  };
}
