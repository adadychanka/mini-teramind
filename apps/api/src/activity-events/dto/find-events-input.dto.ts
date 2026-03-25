import { IsDateString, IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from 'src/common/pagination/pagination-query.dto';

export class FindEventsInputDto extends PaginationQueryDto {
  @IsString()
  @IsDateString()
  @IsOptional()
  from?: string;

  @IsString()
  @IsDateString()
  @IsOptional()
  to?: string;

  @IsString()
  @IsOptional()
  eventType?: string;
}
