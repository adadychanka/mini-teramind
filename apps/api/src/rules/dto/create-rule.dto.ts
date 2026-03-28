import { ApiProperty } from '@nestjs/swagger';
import { CreateRuleDto as ICreateRuleDto } from '@repo/contracts';
import { IsBoolean, IsEnum, IsIn, IsNotEmpty, IsObject, IsString } from 'class-validator';
import { RuleSeverity, RuleType } from 'generated/prisma/enums';

export class CreateRuleDto implements Omit<ICreateRuleDto, 'type' | 'severity'> {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({
    type: String,
    enum: RuleType,
    name: 'type',
    description: 'The type of rule',
    example: RuleType.BLOCKED_WEBSITE.toString(),
  })
  @IsEnum(RuleType)
  @IsNotEmpty()
  @IsIn(Object.values(RuleType))
  type!: RuleType;

  @IsEnum(RuleSeverity)
  @IsNotEmpty()
  @IsIn(Object.values(RuleSeverity))
  severity!: RuleSeverity;

  @IsObject()
  @IsNotEmpty()
  config!: Record<string, unknown>;

  @IsBoolean()
  @IsNotEmpty()
  active!: boolean;
}
