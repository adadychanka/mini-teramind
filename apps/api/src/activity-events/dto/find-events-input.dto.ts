import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { ActivityEventType } from 'generated/prisma/enums';
import { PaginationQueryDto } from 'src/common/pagination/pagination-query.dto';
import { IsDateRangeValid } from 'src/common/validators/is-date-range-valid-decorator';

export class FindEventsInputDto extends PaginationQueryDto {
  @IsString()
  @IsDateString()
  @IsOptional()
  from?: string;

  @IsString()
  @IsDateString()
  @IsOptional()
  @IsDateRangeValid('from', 'to', {
    message: '`from` date must be before `to` date',
  })
  to?: string;

  @IsOptional()
  @IsEnum(ActivityEventType)
  eventType?: ActivityEventType;
}
