import { PartialType } from '@nestjs/swagger';
import { UpdateSessionDto as IUpdateSessionDto, SessionStatus } from '@repo/contracts';
import { IsDateString, IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { CreateSessionDto } from './create-session.dto';

export class UpdateSessionDto extends PartialType(CreateSessionDto) implements IUpdateSessionDto {
  @IsUUID()
  @IsString()
  @IsNotEmpty()
  id!: string;

  @IsEnum(SessionStatus)
  status!: SessionStatus.ENDED;

  @IsDateString()
  endedAt!: string;
}
