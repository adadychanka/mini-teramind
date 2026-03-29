import { RuleType } from 'generated/prisma/enums';
import { validateBlockedWebsiteConfig } from './blocked-website-config-validator';
import { RuleConfigValidationResult, Validator } from './types';

const ruleConfigValidators: Record<RuleType, Validator> = {
  [RuleType.BLOCKED_WEBSITE]: validateBlockedWebsiteConfig,
  [RuleType.AFTER_HOURS]: validateAfterHoursConfig,
};

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
