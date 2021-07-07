using System.Collections.Generic;

namespace DashAccountingSystemV2.Models
{
    public class BalanceSheetReportDto
    {
        public Tenant Tenant { get; set; }

        // TODO/FIXME: This might go away once Tenant model has a default Asset Type
        public AssetType AssetType { get; set; }

        public DateRange DateRange { get; set; }

        public IEnumerable<AccountWithBalanceDto> Assets { get; set; }

        public IEnumerable<AccountWithBalanceDto> Liabilities { get; set; }

        public IEnumerable<AccountWithBalanceDto> Equity { get; set; }

        public decimal NetIncome { get; set; }

        public decimal TotalAssets { get; set; }

        public decimal TotalLiabilities { get; set; }

        public decimal TotalEquity { get; set; }

        public decimal TotalLiabilitiesAndEquity { get; set; }

        public decimal? Discrepency { get; set; }
    }
}
