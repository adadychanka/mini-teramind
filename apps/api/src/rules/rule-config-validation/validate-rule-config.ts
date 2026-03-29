import { RuleType } from 'generated/prisma/enums';
import { validateAfterHoursConfig } from './after-hours-config-validator';
import { validateBlockedWebsiteConfig } from './blocked-website-config-validator';
import { RuleConfigValidationResult, RuleConfigValidator } from './types';

const ruleConfigValidators: Record<RuleType, RuleConfigValidator> = {
  [RuleType.BLOCKED_WEBSITE]: validateBlockedWebsiteConfig,
  [RuleType.AFTER_HOURS]: validateAfterHoursConfig,
};

export async function validateRuleConfig(
  ruleType: RuleType,
  ruleConfig: Record<string, unknown>,
): Promise<RuleConfigValidationResult> {
  const validator = ruleConfigValidators[ruleType];

  if (!validator) {
    return {
      isValid: false,
      errors: [`Invalid rule type: ${ruleType}`],
    };
  }

  const validationResult = await validator(ruleConfig);

  return validationResult;
}
