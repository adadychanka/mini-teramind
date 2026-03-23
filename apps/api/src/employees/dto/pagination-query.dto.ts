import { PaginationInputDto } from '@repo/contracts';
import { Type } from 'class-transformer';
import { IsNumber, Max, Min } from 'class-validator';
import { MAX_EMPLOYEES_PER_PAGE } from '../employees.constants';

export class PaginationQueryDto implements PaginationInputDto {
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(MAX_EMPLOYEES_PER_PAGE)
  limit!: number;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page!: number;
}
