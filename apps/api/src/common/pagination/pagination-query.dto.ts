import { PaginationInputDto } from '@repo/contracts';
import { Type } from 'class-transformer';
import { IsNumber, Max, Min } from 'class-validator';
import { MAX_PAGINATION_LIMIT } from './limits';

export class PaginationQueryDto implements PaginationInputDto {
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(MAX_PAGINATION_LIMIT)
  limit!: number;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page!: number;
}
