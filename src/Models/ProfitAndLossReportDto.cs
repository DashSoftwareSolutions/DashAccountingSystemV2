using System.Collections.Generic;

namespace DashAccountingSystemV2.Models
{
    public class ProfitAndLossReportDto
    {
        public Tenant Tenant { get; set; }

        // TODO/FIXME: This might go away once Tenant model has a default Asset Type
        public AssetType AssetType { get; set; }

        public DateRange DateRange { get; set; }

        public decimal GrossProfit { get; set; }

        public decimal TotalOperatingExpenses { get; set; }

        public decimal NetOperatingIncome { get; set; }

        public decimal TotalOtherIncome { get; set; }

        public decimal TotalOtherExpenses { get; set; }

        public decimal NetOtherIncome { get; set; }

        public decimal NetIncome { get; set; }

        public IEnumerable<AccountWithBalanceDto> OperatingIncome { get; set; }

        public IEnumerable<AccountWithBalanceDto> OtherIncome { get; set; }

        public IEnumerable<AccountWithBalanceDto> OperatingExpenses { get; set; }

        public IEnumerable<AccountWithBalanceDto> OtherExpenses { get; set; }
    }
}
