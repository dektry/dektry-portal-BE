export interface IPaginationResult<PaginationEntity> {
  results: PaginationEntity[];
  total: number;
  currentPage: number;
  next?: number;
  previous?: number;
}
