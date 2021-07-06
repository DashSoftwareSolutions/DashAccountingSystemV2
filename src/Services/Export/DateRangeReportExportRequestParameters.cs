using System;

namespace DashAccountingSystemV2.Services.Export
{
    public class DateRangeReportExportRequestParameters : BaseExportRequestParameters
    {
        public DateTime DateRangeStart { get; set; }

        public DateTime DateRangeEnd { get; set; }
    }
}
