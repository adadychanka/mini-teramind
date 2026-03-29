export type RuleConfigValidationResult = {
  isValid: boolean;
  errors: string[];
};

export type Validator = (config: Record<string, unknown>) => RuleConfigValidationResult;
