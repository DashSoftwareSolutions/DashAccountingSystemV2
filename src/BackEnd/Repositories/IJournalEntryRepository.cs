using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using DashAccountingSystemV2.Models;

namespace DashAccountingSystemV2.Repositories
{
    public interface IJournalEntryRepository
    {
        Task<JournalEntry> CreateJournalEntryAsync(JournalEntry entry);

        Task<JournalEntry> GetByIdAsync(Guid journalEntryId);

        Task<JournalEntry> GetByTenantAndEntryIdAsync(Guid tenantId, uint entryId);

        Task<JournalEntry> GetDetailedByIdAsync(Guid journalEntryId);

        Task<JournalEntry> GetDetailedByTenantAndEntryIdAsync(Guid tenantId, uint entryId);

        Task<PagedResult<JournalEntry>> GetJournalEntriesAsync(
            Guid tenantId,
            DateTime dateRangeStart,
            DateTime dateRangeEnd,
            Pagination pagination);

        Task<IEnumerable<JournalEntryAccount>> GetJournalEntryAccountsAsync(
            Guid tenantId,
            DateTime dateRangeStart,
            DateTime dateRangeEnd);

        Task<IEnumerable<JournalEntryAccount>> GetPostedJournalEntryAccountsAsync(
            Guid tenantId,
            DateTime dateRangeStart,
            DateTime dateRangeEnd,
            params KnownAccountType[] accountTypes);

        Task<uint> GetNextEntryIdAsync(Guid tenantId);

        Task<PagedResult<JournalEntry>> GetPendingJournalEntriesAsync(
            Guid tenantId,
            Pagination pagination);

        Task<JournalEntry> PostJournalEntryAsync(
            Guid journalEntryId,
            DateTime postDate,
            Guid postedByUserId,
            string note = null);
        
        Task<JournalEntry> UpdateCompleteJournalEntryAsync(JournalEntry journalEntry, Guid contextUserId);

        Task<JournalEntry> UpdateJournalEntryNoteOnlyAsync(JournalEntry journalEntry, Guid contextUserId);

        Task<JournalEntry> UpdateJournalEntryTopLevelMetadataAsync(JournalEntry journalEntry, Guid contextUserId);

        Task DeletePendingByTenantAndEntryIdAsync(Guid tenantId, uint entryId);
    }
}
