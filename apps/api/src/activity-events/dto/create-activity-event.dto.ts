import { CreateActivityEventDto as ICreateActivityEventDto } from '@repo/contracts';
import { IsDateString, IsEnum, IsNotEmpty, IsObject, IsString } from 'class-validator';
import { ActivityEventType } from 'generated/prisma/enums';

export class CreateActivityEventDto implements Omit<ICreateActivityEventDto, 'type'> {
  @IsNotEmpty()
  @IsEnum(ActivityEventType)
  type!: ActivityEventType;

  @IsString()
  @IsDateString()
  @IsNotEmpty()
  occurredAt!: string;

  @IsObject()
  @IsNotEmpty()
  metadata!: Record<string, unknown>;
}
