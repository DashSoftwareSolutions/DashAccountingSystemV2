using System;
using Newtonsoft.Json;
using DashAccountingSystemV2.ViewModels.Serialization;

namespace DashAccountingSystemV2.ViewModels
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
