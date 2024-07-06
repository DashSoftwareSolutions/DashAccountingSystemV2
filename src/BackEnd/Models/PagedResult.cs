using DashAccountingSystemV2.BackEnd.Extensions;

namespace DashAccountingSystemV2.BackEnd.Models
{
    public class PagedResult<TModel> where TModel : class
    {
        public PaginationBase Pagination { get; set; }

        public IEnumerable<TModel> Results { get; set; }

        /// <summary>
        /// Count of how many records in total
        /// </summary>
        public int? Total { get; set; }

        /// <summary>
        /// Number of total pages
        /// </summary>
        public int? PageCount => Total.HasValue ? (int?)Math.Ceiling(Total.Value / (double)(Pagination?.PageSize ?? PaginationBase.DefaultPageSize)) : null;

        /// <summary>
        /// Flag indicating whether more records are available to caller when paging
        /// </summary>
        public bool ContainsMoreRecords => Pagination?.PageSize < PaginationBase.DefaultPageSize && (PageCount ?? 0) > Pagination.PageNumber + 1 && Results.HasAny();

        public PagedResult()
        {

        }

        public PagedResult(PaginationBase pagination, IEnumerable<TModel> results, int? total = null)
        {
            Pagination = pagination;
            Results = results;
            Total = total;
        }

        public bool HasAny()
        {
            return Results.HasAny();
        }

        public PagedResult<TViewModel> ToViewModels<TViewModel>(Func<TModel, TViewModel> convertModelToViewModel) where TViewModel : class
        {
            if (Results == null)
                return null;

            return new PagedResult<TViewModel>
            {
                Pagination = Pagination,
                Results = Results.Select(r => convertModelToViewModel(r)),
                Total = Total ?? 0
            };
        }
    }
}
