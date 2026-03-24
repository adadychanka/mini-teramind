import { PartialType } from '@nestjs/swagger';
import { UpdateEmployeeDto as IUpdateEmployeeDto } from '@repo/contracts';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { CreateEmployeeDto } from './create-employee.dto';

export class UpdateEmployeeDto
  extends PartialType(CreateEmployeeDto)
  implements IUpdateEmployeeDto
{
  @IsUUID()
  @IsString()
  @IsNotEmpty()
  id!: string;
}
