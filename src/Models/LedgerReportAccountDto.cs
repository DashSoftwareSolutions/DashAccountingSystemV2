using System.Collections.Generic;

namespace DashAccountingSystemV2.Models
{
    public class LedgerReportAccountDto
    {
        public Account Account { get; set; }

        public decimal StartingBalance { get; set; }

        public IEnumerable<JournalEntryAccount> Transactions { get; set; }
    }
}
