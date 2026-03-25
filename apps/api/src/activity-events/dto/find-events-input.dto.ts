import { IsDateString, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { PaginationQueryDto } from 'src/common/pagination/pagination-query.dto';

export class FindEventsInputDto extends PaginationQueryDto {
  @IsUUID()
  @IsString()
  @IsNotEmpty()
  sessionId!: string;

  @IsString()
  @IsDateString()
  @IsNotEmpty()
  from!: string;

  @IsString()
  @IsDateString()
  @IsNotEmpty()
  to!: string;
}
