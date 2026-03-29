import { Expose, plainToInstance, Type } from 'class-transformer';
import {
  IsMilitaryTime,
  IsNotEmpty,
  IsObject,
  IsString,
  IsTimeZone,
  validate,
  ValidateNested,
} from 'class-validator';
import { IsDateRangeValid } from 'src/common/validators/is-date-range-valid-decorator';
import { RuleConfigValidationResult } from './types';
import { flattenValidationErrors } from './utils';

/**
 * Represents the work hours of an after-hours configuration.
 */
class AfterHoursWorkHours {
  @Expose()
  @IsString()
  @IsNotEmpty()
  @IsMilitaryTime()
  start!: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  @IsMilitaryTime()
  @IsDateRangeValid('start', 'end', {
    message: 'End time must be after start time',
  })
  end!: string;
}

/**
 * Represents the after-hours configuration.
 */
export class AfterHoursConfig {
  @Expose()
  @IsObject()
  @IsNotEmpty()
  @Type(() => AfterHoursWorkHours)
  @ValidateNested()
  workHours!: AfterHoursWorkHours;

  @Expose()
  @IsString()
  @IsNotEmpty()
  @IsTimeZone()
  timezone!: string;
}

export async function validateAfterHoursConfig(
  config: Record<string, unknown>,
): Promise<RuleConfigValidationResult> {
  const afterHoursConfig = plainToInstance<AfterHoursConfig, Record<string, unknown>>(
    AfterHoursConfig,
    config,
    {
      excludeExtraneousValues: true,
    },
  );

  const validationErrors = await validate(afterHoursConfig);
  if (validationErrors.length > 0) {
    const errors = flattenValidationErrors(validationErrors);

    return Promise.resolve({
      isValid: false,
      errors,
    });
  }

  return {
    isValid: true,
    errors: [],
  };
}
