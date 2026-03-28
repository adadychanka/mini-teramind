import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';
import { PaginationQueryDto } from 'src/common/pagination/pagination-query.dto';
import { toOptionalBoolean } from 'src/common/validators/to-optional-boolean';

export class FindRulesInputDto extends PaginationQueryDto {
  @IsOptional()
  @Transform(({ value }) => toOptionalBoolean(value))
  @IsBoolean()
  active?: boolean;
}
