using System.Collections.Generic;
using System.Linq;
using DashAccountingSystemV2.Models;

namespace DashAccountingSystemV2.ViewModels
{
    public class ProfitAndLossReportResponseViewModel
    {
        public ReportDatesResponseViewModel ReportDates { get; set; }

        public AmountViewModel GrossProfit { get; set; }

        public AmountViewModel TotalOperatingExpenses { get; set; }

        public AmountViewModel NetOperatingIncome { get; set; }

        public AmountViewModel TotalOtherIncome { get; set; }

        public AmountViewModel TotalOtherExpenses { get; set; }

        public AmountViewModel NetOtherIncome { get; set; }

        public AmountViewModel NetIncome { get; set; }

        public IEnumerable<ReportAccountResponseViewModel> OperatingIncome { get; set; }

        public IEnumerable<ReportAccountResponseViewModel> OperatingExpenses { get; set; }

        public IEnumerable<ReportAccountResponseViewModel> OtherIncome { get; set; }

        public IEnumerable<ReportAccountResponseViewModel> OtherExpenses { get; set; }

        public static ProfitAndLossReportResponseViewModel FromModel(ProfitAndLossReportDto profitAndLossReportData)
        {
            if (profitAndLossReportData == null)
                return null;

            return new ProfitAndLossReportResponseViewModel()
            {
                GrossProfit = new AmountViewModel(profitAndLossReportData.GrossProfit, profitAndLossReportData.AssetType),
                TotalOperatingExpenses = new AmountViewModel(profitAndLossReportData.TotalOperatingExpenses, profitAndLossReportData.AssetType),
                NetOperatingIncome = new AmountViewModel(profitAndLossReportData.NetOperatingIncome, profitAndLossReportData.AssetType),
                TotalOtherIncome = new AmountViewModel(profitAndLossReportData.TotalOtherIncome, profitAndLossReportData.AssetType),
                TotalOtherExpenses = new AmountViewModel(profitAndLossReportData.TotalOtherExpenses, profitAndLossReportData.AssetType),
                NetOtherIncome = new AmountViewModel(profitAndLossReportData.NetOtherIncome, profitAndLossReportData.AssetType),
                NetIncome = new AmountViewModel(profitAndLossReportData.NetIncome, profitAndLossReportData.AssetType),
                OperatingIncome = profitAndLossReportData.OperatingIncome.Select(ReportAccountResponseViewModel.FromModel),
                OperatingExpenses = profitAndLossReportData.OperatingExpenses.Select(ReportAccountResponseViewModel.FromModel),
                OtherIncome = profitAndLossReportData.OtherIncome.Select(ReportAccountResponseViewModel.FromModel),
                OtherExpenses = profitAndLossReportData.OtherExpenses.Select(ReportAccountResponseViewModel.FromModel),
            };
        }
    }
}
