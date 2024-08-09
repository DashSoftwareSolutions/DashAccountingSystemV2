namespace DashAccountingSystemV2.BackEnd.Models
{
    public class LedgerReportAccountDto
    {
        public Account Account { get; set; }

        public decimal StartingBalance { get; set; }

        public IEnumerable<JournalEntryAccount> Transactions { get; set; }
    }
}
