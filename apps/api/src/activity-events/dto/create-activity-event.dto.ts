import {
  ActivityEventType,
  CreateActivityEventDto as ICreateActivityEventDto,
} from '@repo/contracts';
import { IsDateString, IsEnum, IsNotEmpty, IsObject, IsString } from 'class-validator';

export class CreateActivityEventDto implements ICreateActivityEventDto {
  @IsEnum(ActivityEventType)
  @IsNotEmpty()
  type!: ActivityEventType;

  @IsString()
  @IsDateString()
  @IsNotEmpty()
  occurredAt!: string;

  @IsObject()
  @IsNotEmpty()
  metadata!: Record<string, unknown>;
}
