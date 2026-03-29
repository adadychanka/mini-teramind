export type RuleConfigValidationResult = {
  isValid: boolean;
  errors: string[];
};

export type RuleConfigValidator = (
  config: Record<string, unknown>,
) => Promise<RuleConfigValidationResult>;
