import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateActivityEventDto {
  @IsUUID()
  @IsString()
  @IsNotEmpty()
  sessionId!: string;
}
