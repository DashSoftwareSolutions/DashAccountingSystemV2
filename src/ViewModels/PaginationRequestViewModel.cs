using System;
using System.Collections.Generic;
using DashAccountingSystemV2.Extensions;
using DashAccountingSystemV2.Models;

namespace DashAccountingSystemV2.ViewModels
{
    public class PaginationRequestViewModel
    {
        /// <summary>
        /// Current page of paged record sets.  First page number is 1.
        /// </summary>
        public int? PageNumber { get; set; }

        /// <summary>
        /// Size of paged record sets.
        /// </summary>
        public int? PageSize { get; set; }

        /// <summary>
        /// Represents the Sort specification. This is a comma-separated string value where each item represents a column/alias
        /// to sort by.  To specify sorting by descending order, the value should be prefixed with a "-".
        /// Otherwise it represents an ascending sort.
        /// </summary>
        public string SortBy { get; set; }

        public static Pagination ToModel(PaginationRequestViewModel viewModel)
        {
            var pagination = viewModel == null ?
                new Pagination() :
                new Pagination()
                {
                    PageNumber = viewModel.PageNumber,
                    PageSize = viewModel.PageSize,
                    SortBy = viewModel.SortBy,
                };

            CoalesceValues(pagination);

            return pagination;
        }

        private static void CoalesceValues(Pagination pagination)
        {
            // Coalesce with configuration fallbacks
            pagination.PageNumber = pagination?.PageNumber ?? 1; // A value other than 1 for page number doesn't make sense as a default
            pagination.PageSize = pagination?.PageSize ?? DefaultPageSize;

            // Reconcile with acceptable ranges (user could pass in unacceptable values -- these should not throw exceptions, but be set to acceptable values)
            pagination.PageNumber = pagination.PageNumber.Value.EnsureIsPositive(1); // page number is only meaningful for >= 1
            pagination.PageSize = pagination.PageSize.Value.CoalesceInRange(1, MaximumPageSize); // Page size must be between 1 and max page size

            // Get the each sort specification value and determine the direction of each. If prefixed with "-", then Descending.  Otherwise Ascending.
            var sort = pagination.SortBy;

            if (!string.IsNullOrEmpty(sort))
            {
                var sortColumnValues = sort.Split(new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries);

                if (sortColumnValues.Length > 0)
                {
                    pagination.SortColumns = new List<Sorting>();

                    foreach (var sortColumn in sortColumnValues)
                    {
                        if (sortColumn.StartsWith("-"))
                        {
                            pagination.SortColumns.Add(
                                new Sorting()
                                {
                                    SortColumn = sortColumn.TrimStart(new char[] { '-' }),
                                    SortDirection = SortDirection.Descending
                                });
                        }
                        else
                        {
                            pagination.SortColumns.Add(
                                new Sorting()
                                {
                                    SortColumn = sortColumn,
                                    SortDirection = SortDirection.Ascending
                                });
                        }
                    }
                }
            }
        }

        private const int DefaultPageSize = 25;
        private const int MaximumPageSize = int.MaxValue;
    }
}
