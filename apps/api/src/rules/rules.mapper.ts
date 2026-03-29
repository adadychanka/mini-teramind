import { RuleDto, RuleSeverity, RuleType } from '@repo/contracts';
import {
  Prisma,
  Rule,
  RuleSeverity as RuleSeverityDb,
  RuleType as RuleTypeDb,
} from 'generated/prisma/client';
import { BlockedWebsiteConfig } from './rule-config-validation/blocked-website-config-validator';

function toRuleType(ruleType: RuleTypeDb): RuleType {
  return RuleType[ruleType as keyof typeof RuleType];
}

function toRuleSeverity(ruleSeverity: RuleSeverityDb): RuleSeverity {
  return RuleSeverity[ruleSeverity as keyof typeof RuleSeverity];
}

export function toRuleConfig(config: Prisma.JsonValue): Record<string, unknown> {
  if (typeof config === 'object' && config !== null && !Array.isArray(config)) {
    return config as Record<string, unknown>;
  }
  return {};
}

export function toRuleDto(rule: Rule): RuleDto {
  return {
    id: rule.id,
    name: rule.name,
    description: rule.description ?? undefined,
    type: toRuleType(rule.type),
    severity: toRuleSeverity(rule.severity),
    config: toRuleConfig(rule.config),
    active: rule.active,
    createdAt: rule.createdAt.toISOString(),
    updatedAt: rule.updatedAt.toISOString(),
  };
}

export function normalizeRuleConfig(
  ruleType: RuleTypeDb,
  config: Record<string, unknown>,
): Record<string, unknown> {
  if (ruleType === RuleTypeDb.BLOCKED_WEBSITE) {
    const blockedWebsiteConfig = config as BlockedWebsiteConfig;
    const pattern = blockedWebsiteConfig?.pattern ?? '';
    const normalizedPattern = pattern.trim();

    return {
      ...blockedWebsiteConfig,
      pattern: normalizedPattern,
    };
  }

  return config;
}
