import { CreateSessionDto as ICreateSessionDto } from '@repo/contracts';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateSessionDto implements ICreateSessionDto {
  @IsUUID()
  @IsString()
  @IsNotEmpty()
  employeeId!: string;
}
