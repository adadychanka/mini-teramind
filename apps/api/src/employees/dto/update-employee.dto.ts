import { PartialType } from '@nestjs/swagger';
import { UpdateEmployeeDto as IUpdateEmployeeDto } from '@repo/contracts';
import { CreateEmployeeDto } from './create-employee.dto';

export class UpdateEmployeeDto
  extends PartialType(CreateEmployeeDto)
  implements IUpdateEmployeeDto {}
