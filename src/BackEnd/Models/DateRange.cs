namespace DashAccountingSystemV2.BackEnd.Models
{
    public class DateRange
    {
        public DateTime DateRangeStart { get; set; }

        public DateTime DateRangeEnd { get; set; }

        public DateRange() { }

        public DateRange(DateTime dateRangeStart, DateTime dateRangeEnd)
        {
            DateRangeStart = dateRangeStart;
            DateRangeEnd = dateRangeEnd;
        }
    }
}
