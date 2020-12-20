using System.Collections.Generic;
using DashAccountingSystemV2.Extensions;

namespace DashAccountingSystemV2.Models
{
    public class PagedResult<TModel> where TModel : class
    {
        public Pagination Pagination { get; set; }

        public IEnumerable<TModel> Results { get; set; }

        public PagedResult()
        {
            Results = new List<TModel>();
        }

        public bool HasAny()
        {
            return Results.HasAny();
        }
    }
}
