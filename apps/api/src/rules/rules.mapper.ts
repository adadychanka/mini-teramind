import { RuleDto, RuleSeverity, RuleType } from '@repo/contracts';
import {
  Prisma,
  Rule,
  RuleSeverity as RuleSeverityDb,
  RuleType as RuleTypeDb,
} from 'generated/prisma/client';

function toRuleType(ruleType: RuleTypeDb): RuleType {
  return RuleType[ruleType as keyof typeof RuleType];
}

function toRuleSeverity(ruleSeverity: RuleSeverityDb): RuleSeverity {
  return RuleSeverity[ruleSeverity as keyof typeof RuleSeverity];
}

function toRuleConfig(config: Prisma.JsonValue): Record<string, unknown> {
  if (typeof config === 'object' && config !== null && !Array.isArray(config)) {
    return config as Record<string, unknown>;
  }
  return {};
}

export function toRuleDto(rule: Rule): RuleDto {
  return {
    id: rule.id,
    name: rule.name,
    type: toRuleType(rule.type),
    severity: toRuleSeverity(rule.severity),
    config: toRuleConfig(rule.config),
    active: rule.active,
    createdAt: rule.createdAt.toISOString(),
    updatedAt: rule.updatedAt.toISOString(),
  };
}
