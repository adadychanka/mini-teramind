export interface PaginationInputDto {
  page: number;
  limit: number;
}

export interface PaginationOutputDto<T> {
  items: T[];
  total: number;
  hasNextPage: boolean;
}
