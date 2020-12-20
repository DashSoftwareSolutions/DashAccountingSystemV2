using System;
using System.Threading.Tasks;
using DashAccountingSystemV2.Models;

namespace DashAccountingSystemV2.Repositories
{
    public interface IJournalEntryRepository
    {
        Task<JournalEntry> CreateJournalEntryAsync(JournalEntry entry);

        Task<JournalEntry> GetByIdAsync(Guid journalEntryId);

        Task<JournalEntry> GetByTenantAndEntryIdAsync(Guid tenantId, int entryId);

        Task<JournalEntry> GetDetailedByIdAsync(Guid journalEntryId);

        Task<JournalEntry> GetDetailedByTenantAndEntryIdAsync(Guid tenantId, int entryId);

        Task<PagedResult<JournalEntry>> GetJournalEntriesAsync(
            Guid tenantId,
            DateTime dateRangeStart,
            DateTime dateRangeEnd,
            Pagination pagination);

        Task<uint> GetNextEntryIdAsync(Guid tenantId);

        Task<PagedResult<JournalEntry>> GetPendingJournalEntriesAsync(
            Guid tenantId,
            Pagination pagination);

        Task<JournalEntry> PostJournalEntryAsync(
            Guid journalEntryId,
            DateTime postDate,
            Guid postedByUserId,
            string note = null);
    }
}
