import { CreateRuleDto as ICreateRuleDto, RuleSeverity, RuleType } from '@repo/contracts';
import { IsBoolean, IsEnum, IsNotEmpty, IsObject, IsString } from 'class-validator';

export class CreateRuleDto implements ICreateRuleDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsEnum(RuleType)
  @IsNotEmpty()
  type!: RuleType;

  @IsEnum(RuleSeverity)
  @IsNotEmpty()
  severity!: RuleSeverity;

  @IsObject()
  @IsNotEmpty()
  config!: Record<string, unknown>;

  @IsBoolean()
  @IsNotEmpty()
  active!: boolean;
}
