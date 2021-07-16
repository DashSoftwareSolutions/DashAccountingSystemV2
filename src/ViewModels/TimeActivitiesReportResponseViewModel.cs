using System.Collections.Generic;
using System.Linq;
using DashAccountingSystemV2.Models;

namespace DashAccountingSystemV2.ViewModels
{
    public class TimeActivitiesReportResponseViewModel
    {
        public AssetTypeViewModel DefaultAssetType { get; set; }

        public ReportDatesResponseViewModel ReportDates { get; set; }

        public IEnumerable<TimeActivityResponseViewModel> TimeActivities { get; set; }

        public static TimeActivitiesReportResponseViewModel FromModel(TimeActivityDetailsReportDto reportData)
        {
            if (reportData == null)
                return null;

            return new TimeActivitiesReportResponseViewModel()
            {
                DefaultAssetType = AssetTypeViewModel.FromModel(reportData.Tenant.DefaultAssetType),
                ReportDates = new ReportDatesResponseViewModel(reportData.DateRange.DateRangeStart, reportData.DateRange.DateRangeEnd),
                TimeActivities = reportData.TimeActivities
                    ?.Select(TimeActivityResponseViewModel.FromModel)
                    ?? Enumerable.Empty<TimeActivityResponseViewModel>(),
            };
        }
    }
}
