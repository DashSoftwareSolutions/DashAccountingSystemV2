using System.Collections.Generic;
using System.Linq;
using Newtonsoft.Json;
using DashAccountingSystemV2.Models;

namespace DashAccountingSystemV2.ViewModels
{
    public class BalanceSheetReportResponseViewModel
    {
        public AmountViewModel TotalAssets { get; set; }

        public AmountViewModel TotalLiabilities { get; set; }

        public AmountViewModel TotalEquity { get; set; }

        public AmountViewModel NetIncome { get; set; }

        public AmountViewModel TotalLiabilitiesAndEquity { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public AmountViewModel Discrepency { get; set; }

        public IEnumerable<BalanceSheetAccountResponseViewModel> Assets { get; set; }

        public IEnumerable<BalanceSheetAccountResponseViewModel> Liabilities { get; set; }

        public IEnumerable<BalanceSheetAccountResponseViewModel> Equity { get; set; }

        public static BalanceSheetReportResponseViewModel FromModel(BalanceSheetReportDto balanceSheetReportData)
        {
            if (balanceSheetReportData == null)
                return null;

            return new BalanceSheetReportResponseViewModel()
            {
                TotalAssets = new AmountViewModel(balanceSheetReportData.TotalAssets, balanceSheetReportData.AssetType),
                TotalLiabilities = new AmountViewModel(balanceSheetReportData.TotalLiabilities, balanceSheetReportData.AssetType),
                TotalEquity = new AmountViewModel(balanceSheetReportData.TotalEquity, balanceSheetReportData.AssetType),
                NetIncome = new AmountViewModel(balanceSheetReportData.NetIncome, balanceSheetReportData.AssetType),
                TotalLiabilitiesAndEquity = new AmountViewModel(balanceSheetReportData.TotalLiabilitiesAndEquity, balanceSheetReportData.AssetType),

                Discrepency = balanceSheetReportData.Discrepency.HasValue ?
                    new AmountViewModel(balanceSheetReportData.Discrepency.Value, balanceSheetReportData.AssetType) :
                    null,

                Assets = balanceSheetReportData.Assets.Select(BalanceSheetAccountResponseViewModel.FromModel),
                Liabilities = balanceSheetReportData.Liabilities.Select(BalanceSheetAccountResponseViewModel.FromModel),
                Equity = balanceSheetReportData.Equity.Select(BalanceSheetAccountResponseViewModel.FromModel),
            };
        }
    }
}
