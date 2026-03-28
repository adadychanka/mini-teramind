export enum RuleSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

export enum RuleType {
  BLOCKED_WEBSITE = 'BLOCKED_WEBSITE',
  AFTER_HOURS = 'AFTER_HOURS',
}

export interface RuleDto {
  id: string;
  name: string;
  type: RuleType;
  severity: RuleSeverity;
  config: Record<string, unknown>;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRuleDto {
  name: string;
  type: RuleType;
  severity: RuleSeverity;
  config: Record<string, unknown>;
  active: boolean;
}

export interface UpdateRuleDto {
  id?: string | undefined;
  name?: string;
  type?: RuleType;
  severity?: RuleSeverity;
  config?: Record<string, unknown>;
  active?: boolean;
}
