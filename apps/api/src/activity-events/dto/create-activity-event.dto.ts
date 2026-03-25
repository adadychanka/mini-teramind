import { IsDateString, IsNotEmpty, IsObject, IsString } from 'class-validator';

export class CreateActivityEventDto {
  @IsString()
  @IsNotEmpty()
  eventType!: string;

  @IsString()
  @IsDateString()
  @IsNotEmpty()
  occurredAt!: string;

  @IsObject()
  @IsNotEmpty()
  metadata!: Record<string, any>;
}
