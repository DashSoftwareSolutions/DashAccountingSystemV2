using DashAccountingSystemV2.BackEnd.Models;

namespace DashAccountingSystemV2.BackEnd.BusinessLogic
{
    public interface IJournalEntryBusinessLogic : IBusinessLogic
    {
        Task<BusinessLogicResponse<JournalEntry>> GetJournalEntryByTenantAndEntryId(Guid tenantId, uint entryId);

        Task<BusinessLogicResponse<JournalEntry>> CreateJournalEntry(JournalEntry journalEntry);

        Task<BusinessLogicResponse<JournalEntry>> PostJournalEntry(
            Guid tenantId,
            uint entryId,
            DateTime postDate,
            Guid postedByUserId,
            string? note = null);

        Task<BusinessLogicResponse<JournalEntry>> UpdateJournalEntry(JournalEntry journalEntry, Guid contextUserId);

        Task<BusinessLogicResponse> DeletePendingJournalEntryByTenantAndEntryId(Guid tenantId, uint entryId);
    }
}
