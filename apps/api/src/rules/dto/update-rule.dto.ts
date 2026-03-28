import { PartialType } from '@nestjs/swagger';
import { UpdateRuleDto as IUpdateRuleDto } from '@repo/contracts';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { CreateRuleDto } from './create-rule.dto';

export class UpdateRuleDto extends PartialType(CreateRuleDto) implements IUpdateRuleDto {
  @IsUUID()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  id?: string;
}
