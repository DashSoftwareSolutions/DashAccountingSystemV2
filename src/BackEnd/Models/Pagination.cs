namespace DashAccountingSystemV2.BackEnd.Models
{
    public class Pagination : PaginationBase
    {
        #region - Sorting -

        /// <summary>
        /// Represents the Sort specification. This is a comma-separated string value where each item represents a column/alias
        /// to sort by.  To specify sorting by descending order, the value should be prefixed with a "-".
        /// Otherwise it represents an ascending sort.
        /// </summary>
        public string? SortBy { get; set; }

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

        #region - DB related -
        public int Offset => PageSize.HasValue ? ((PageNumber ?? 1) - 1) * PageSize.Value : 0; /* Using 1-based page numbers  */

        public int Limit => PageSize ?? DefaultPageSize;

        /// <summary>
        /// Used for SQL text generation
        /// DO NOT use it as request variable (use Limit instead), Npgsql does not recognize it as correct value for limit.
        /// Note that "LIMIT ALL" seems to be valid syntax for PostgreSQL itself (e.g. it works in queries run in DBeaver),
        /// but the Npgsql/Dapper powered queries will fail with the error message
        /// "PostgresException: 42804: argument of LIMIT must be type bigint, not type text".  ¯\_(ツ)_/¯
        /// </summary>
        public string DBLimit => Limit == DefaultPageSize ? "ALL" : Limit.ToString();
        #endregion - DB related -

        /// <summary>
        /// Default pagination parameters.  <see cref="Pagination.PageSize"/> is <see cref="int.MaxValue"/> so use with caution!
        /// </summary>
        public static Pagination Default => new Pagination
        {
            PageNumber = 1, /* Using 1-based page numbers  */
            PageSize = int.MaxValue
        };

        #region Pagination data operations for consequential execution 
        public Pagination SetPageSize(int pageSize)
        {
            PageSize = pageSize;
            return this;
        }

        public Pagination SetPageNumber(int pageNumber)
        {
            PageNumber = pageNumber;
            return this;
        }

        public Pagination Clone()
        {
            return (Pagination)MemberwiseClone();
        }
        #endregion Pagination data operations for consequential execution
    }
}
