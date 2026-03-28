import { RuleType } from 'generated/prisma/enums';

export type RuleConfigValidationResult = {
  isValid: boolean;
  errors: string[];
};

type Validator = (config: Record<string, unknown>) => RuleConfigValidationResult;

const ruleConfigValidators: Record<RuleType, Validator> = {
  [RuleType.BLOCKED_WEBSITE]: validateBlockedWebsiteConfig,
  [RuleType.AFTER_HOURS]: validateAfterHoursConfig,
};

function validateBlockedWebsiteConfig(config: Record<string, unknown>): RuleConfigValidationResult {
  return {
    isValid: true,
    errors: [],
  };
}

function validateAfterHoursConfig(config: Record<string, unknown>): RuleConfigValidationResult {
  return {
    isValid: true,
    errors: [],
  };
}

export function validateRuleConfig(
  ruleType: RuleType,
  ruleConfig: Record<string, unknown>,
): RuleConfigValidationResult {
  const validator = ruleConfigValidators[ruleType];
  if (!validator) {
    return {
      isValid: false,
      errors: [`Invalid rule type: ${ruleType}`],
    };
  }

  return validator(ruleConfig);
}
