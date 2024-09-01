import Pagination from './pagination.model';

export default interface PagedResult<TResult> {
    containsMorePages: boolean;
    pageCount: number | null;
    pagination: Pagination;
    results: TResult[];
    total: number | null;
}
