namespace DashAccountingSystemV2.Models
{
    public class Sorting
    {
        public string SortColumn { get; set; }
        public SortDirection SortDirection { get; set; }

        public Sorting()
        {

        }

        public Sorting(string sortColumn, SortDirection sortDirection)
        {
            SortColumn = sortColumn;
            SortDirection = sortDirection;
        }
    }
}
