export interface PaginationResultInterface<PaginationEntity> {
  results: PaginationEntity[];
  total: number;
  currentPage: number,
  next?: number;
  previous?: number;
}
