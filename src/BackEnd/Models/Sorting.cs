namespace DashAccountingSystemV2.BackEnd.Models
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
