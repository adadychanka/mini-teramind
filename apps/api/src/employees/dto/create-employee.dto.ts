import { CreateEmployeeDto as ICreateEmployeeDto } from '@repo/contracts';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

/**
 * API DTO for creating an employee.
 */
export class CreateEmployeeDto implements ICreateEmployeeDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name!: string;

  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  department?: string;
}
