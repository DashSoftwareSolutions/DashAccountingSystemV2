using System.Text.Json.Serialization;
using DashAccountingSystemV2.BackEnd.ViewModels.Serialization;

namespace DashAccountingSystemV2.BackEnd.ViewModels
{
    public class ReportDatesResponseViewModel
    {
        [JsonConverter(typeof(JsonDateConverter))]
        public DateTime DateRangeStart { get; set; }

        [JsonConverter(typeof(JsonDateConverter))]
        public DateTime DateRangeEnd { get; set; }

        public ReportDatesResponseViewModel() { }

        public ReportDatesResponseViewModel(DateTime dateRangeStart, DateTime dateRangeEnd)
        {
            DateRangeStart = dateRangeStart;
            DateRangeEnd = dateRangeEnd;
        }
    }
}
