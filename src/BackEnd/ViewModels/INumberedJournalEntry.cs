using DashAccountingSystemV2.BackEnd.Models;

namespace DashAccountingSystemV2.BackEnd.ViewModels
{
    public interface INumberedJournalEntry
    {
        uint EntryId { get; }
        TransactionStatus Status { get; }
    }
}
