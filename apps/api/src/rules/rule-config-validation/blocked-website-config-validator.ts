import { RuleConfigValidationResult } from './types';

export type BlockedWebsiteConfig = {
  pattern: string;
};

const MIN_LENGTH = 3;
const MAX_LENGTH = 255;

/** Allowed chars: letters, digits, dot, hyphen, asterisk.
 * */
const ALLOWED_PATTERN_CHARS = /^[a-z0-9.*-]+$/i;

/**
 * Validates the allowed characters in the pattern.
 * @param pattern - The pattern to validate.
 * @returns True if the pattern is valid, false otherwise.
 */
function validateAllowedPatternChars(pattern: string): boolean {
  return ALLOWED_PATTERN_CHARS.test(pattern);
}

/**
 * Each dot-separated label must be either "*" or a non-empty hostname label
 * (no "*" inside a label except the whole label).
 */
function validatePatternLabels(pattern: string): RuleConfigValidationResult | null {
  const labels = pattern.split('.');
  if (labels.length < 1 || labels.some((label) => label.length === 0)) {
    return {
      isValid: false,
      errors: ['Pattern has invalid empty label (check for leading/trailing or consecutive dots)'],
    };
  }
  for (const label of labels) {
    if (label === '*') {
      continue;
    }
    if (label.includes('*')) {
      return {
        isValid: false,
        errors: ['Wildcard * may only appear as an entire label (e.g. *.example.com)'],
      };
    }
  }

  return null;
}

export async function validateBlockedWebsiteConfig(
  config: Record<string, unknown>,
): Promise<RuleConfigValidationResult> {
  const blockedWebsiteConfig = config as BlockedWebsiteConfig;
  if (!blockedWebsiteConfig.pattern) {
    return Promise.resolve({
      isValid: false,
      errors: ['Pattern is required'],
    });
  }

  if (typeof blockedWebsiteConfig.pattern !== 'string') {
    return Promise.resolve({
      isValid: false,
      errors: ['Pattern must be a string'],
    });
  }

  const trimmedPattern = blockedWebsiteConfig.pattern.trim();
  if (trimmedPattern.length < MIN_LENGTH || trimmedPattern.length > MAX_LENGTH) {
    return Promise.resolve({
      isValid: false,
      errors: ['Pattern must be between 3 and 255 characters'],
    });
  }

  if (!validateAllowedPatternChars(trimmedPattern)) {
    return Promise.resolve({
      isValid: false,
      errors: ['Pattern contains invalid characters'],
    });
  }

  const labelValidationResult = validatePatternLabels(trimmedPattern);
  if (labelValidationResult) {
    return Promise.resolve(labelValidationResult);
  }

  return Promise.resolve({
    isValid: true,
    errors: [],
  });
}
