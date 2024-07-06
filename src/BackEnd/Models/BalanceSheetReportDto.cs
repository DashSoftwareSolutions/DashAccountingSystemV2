namespace DashAccountingSystemV2.BackEnd.Models
{
    public class BalanceSheetReportDto
    {
        public Tenant Tenant { get; set; }

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
