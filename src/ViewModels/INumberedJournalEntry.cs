using DashAccountingSystemV2.Models;

namespace DashAccountingSystemV2.ViewModels
{
    public interface INumberedJournalEntry
    {
        uint EntryId { get; }
        TransactionStatus Status { get; }
    }
}
