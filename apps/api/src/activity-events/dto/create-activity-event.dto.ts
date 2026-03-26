import { ApiProperty } from '@nestjs/swagger';
import { CreateActivityEventDto as ICreateActivityEventDto } from '@repo/contracts';
import { IsDateString, IsEnum, IsIn, IsNotEmpty, IsObject } from 'class-validator';
import { ActivityEventType } from 'generated/prisma/enums';

export class CreateActivityEventDto implements Omit<ICreateActivityEventDto, 'type'> {
  @ApiProperty({
    type: String,
    enum: ActivityEventType,
    name: 'type',
    description: 'The type of activity event',
    example: 'APP',
  })
  @IsNotEmpty()
  @IsEnum(ActivityEventType)
  @IsIn(Object.values(ActivityEventType))
  type!: ActivityEventType;

  @ApiProperty({
    type: String,
    format: 'date-time',
    name: 'occurredAt',
    description: 'The date and time the activity event occurred',
    example: '2026-03-26T10:00:00Z',
  })
  @IsDateString()
  @IsNotEmpty()
  occurredAt!: string;

  @IsObject()
  @IsNotEmpty()
  metadata!: Record<string, unknown>;
}
