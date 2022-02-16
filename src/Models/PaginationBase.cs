using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DashAccountingSystemV2.Models
{
    public class PaginationBase
    {
        /// <summary>
        /// Current page of paged record sets
        /// </summary>
        public int? PageNumber { get; set; }

        /// <summary>
        /// Size of paged record sets
        /// </summary>
        public int? PageSize { get; set; }

        /// <summary>
        /// Default page size
        /// </summary>
        /// <remarks>
        /// Some code requires DefaultPageSize == int.MaxValue (via Pagination.Default)
        /// So changing default size can lead to unpredictable results
        /// </remarks>
        public const int DefaultPageSize = int.MaxValue;
    }
}
