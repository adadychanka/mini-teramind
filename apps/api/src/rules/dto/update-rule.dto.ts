import { OmitType, PartialType } from '@nestjs/swagger';
import { UpdateRuleDto as IUpdateRuleDto } from '@repo/contracts';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { CreateRuleDto } from './create-rule.dto';

export class UpdateRuleDto
  extends OmitType(PartialType(CreateRuleDto), ['type'])
  implements IUpdateRuleDto
{
  @IsUUID()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  id?: string;
}
