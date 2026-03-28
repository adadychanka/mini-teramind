import { IsBoolean, IsOptional } from 'class-validator';
import { PaginationQueryDto } from 'src/common/pagination/pagination-query.dto';

export class FindRulesInputDto extends PaginationQueryDto {
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
