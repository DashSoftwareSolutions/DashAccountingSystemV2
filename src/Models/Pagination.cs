using System.Collections.Generic;
using System.Linq;

namespace DashAccountingSystemV2.Models
{
    public class Pagination : PaginationBase
    {
        #region - Sorting -

        /// <summary>
        /// Represents the Sort Query. This is a comma	separated value where each value  represents a column/alias
        /// to sort by.  To specify sorting by descending order, the value should be prefixed with a "-".
        /// Otherwise it represents ascending.
        /// </summary>
        public string SortQuery { get; set; }

        /// <summary>
        /// Sort Columns that are translated from the SortingQuery
        /// </summary>
        public List<Sorting> SortColumns { get; set; }

        /// <summary>
        /// Gets the first sort column.
        /// </summary>
        public string SortColumn
        {
            get { return SortColumns?.FirstOrDefault()?.SortColumn; }
            set
            {
                if (SortColumns?.Count == 1)
                    SortColumns[0].SortColumn = value;
                else
                    SortColumns =
                        new List<Sorting>
                        {
                            new Sorting
                            {
                                SortColumn = value,
                                SortDirection = SortDirection.Ascending
                            }
                        };
            }
        }

        /// <summary>
        /// Gets whether the sort is descending.
        /// </summary>
        public bool IsDescendingSort
        {
            get { return SortColumns?.FirstOrDefault()?.SortDirection == SortDirection.Descending; }
            set
            {
                if (SortColumns?.Count == 1)
                    SortColumns[0].SortDirection = value ? SortDirection.Descending : SortDirection.Ascending;
                else
                    SortColumns =
                        new List<Sorting>
                        {
                            new Sorting
                            {
                                SortDirection = value ? SortDirection.Descending : SortDirection.Ascending
                            }
                        };
            }
        }

        #endregion - Sorting -

        // TODO: PageSize should be limited to some reasonable value (e.g., see PaginationValidationFilterAttribute.cs)

        public static Pagination Default => new Pagination
        {
            PageNumber = 1, /* Using 1-based page numbers  */
            PageSize = int.MaxValue
        };
    }
}
