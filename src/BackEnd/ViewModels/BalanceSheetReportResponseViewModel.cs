using System.Text.Json.Serialization;
using DashAccountingSystemV2.BackEnd.Models;

namespace DashAccountingSystemV2.BackEnd.ViewModels
{
    public class BalanceSheetReportResponseViewModel
    {
        public ReportDatesResponseViewModel ReportDates { get; set; }

        public AmountViewModel TotalAssets { get; set; }

        public AmountViewModel TotalLiabilities { get; set; }

        public AmountViewModel TotalEquity { get; set; }

        public AmountViewModel NetIncome { get; set; }

        public AmountViewModel TotalLiabilitiesAndEquity { get; set; }

        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public AmountViewModel Discrepency { get; set; }

        public IEnumerable<ReportAccountResponseViewModel> Assets { get; set; }

        public IEnumerable<ReportAccountResponseViewModel> Liabilities { get; set; }

        public IEnumerable<ReportAccountResponseViewModel> Equity { get; set; }

        public static BalanceSheetReportResponseViewModel FromModel(BalanceSheetReportDto balanceSheetReportData)
        {
            if (balanceSheetReportData == null)
                return null;

            return new BalanceSheetReportResponseViewModel()
            {
                TotalAssets = new AmountViewModel(balanceSheetReportData.TotalAssets, balanceSheetReportData.Tenant.DefaultAssetType),
                TotalLiabilities = new AmountViewModel(balanceSheetReportData.TotalLiabilities, balanceSheetReportData.Tenant.DefaultAssetType),
                TotalEquity = new AmountViewModel(balanceSheetReportData.TotalEquity, balanceSheetReportData.Tenant.DefaultAssetType),
                NetIncome = new AmountViewModel(balanceSheetReportData.NetIncome, balanceSheetReportData.Tenant.DefaultAssetType),
                TotalLiabilitiesAndEquity = new AmountViewModel(balanceSheetReportData.TotalLiabilitiesAndEquity, balanceSheetReportData.Tenant.DefaultAssetType),

                Discrepency = balanceSheetReportData.Discrepency.HasValue ?
                    new AmountViewModel(balanceSheetReportData.Discrepency.Value, balanceSheetReportData.Tenant.DefaultAssetType) :
                    null,

                Assets = balanceSheetReportData.Assets.Select(ReportAccountResponseViewModel.FromModel),
                Liabilities = balanceSheetReportData.Liabilities.Select(ReportAccountResponseViewModel.FromModel),
                Equity = balanceSheetReportData.Equity.Select(ReportAccountResponseViewModel.FromModel),
            };
        }
    }
}
