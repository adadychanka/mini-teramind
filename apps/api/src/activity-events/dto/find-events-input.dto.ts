import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { ActivityEventType } from 'generated/prisma/enums';
import { PaginationQueryDto } from 'src/common/pagination/pagination-query.dto';
import { IsDateRangeValid } from 'src/common/validators/isDateRangeValidDecorator';

@IsDateRangeValid('from', 'to', {
  message: '`from` date must be before `to` date',
})
export class FindEventsInputDto extends PaginationQueryDto {
  @IsString()
  @IsDateString()
  @IsOptional()
  from?: string;

  @IsString()
  @IsDateString()
  @IsOptional()
  to?: string;

  @IsOptional()
  @IsEnum(ActivityEventType)
  eventType?: ActivityEventType;
}
