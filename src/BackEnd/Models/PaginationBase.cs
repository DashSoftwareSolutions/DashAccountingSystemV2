﻿namespace DashAccountingSystemV2.BackEnd.Models
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
        internal const int DefaultPageSize = int.MaxValue;
    }
}
