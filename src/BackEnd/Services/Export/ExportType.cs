namespace DashAccountingSystemV2.BackEnd.Services.Export
{
    public enum ExportType : ushort
    {
        Unknown = 0,
        LedgerReport = 1,
        BalanceSheetReport = 2,
        ProfitAndLossReport = 3,
        Invoice = 4,
    }
}
