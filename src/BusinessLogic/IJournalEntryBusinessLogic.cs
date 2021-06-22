using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DashAccountingSystemV2.Models;

namespace DashAccountingSystemV2.BusinessLogic
{
    public interface IJournalEntryBusinessLogic
    {
        Task<BusinessLogicResponse<JournalEntry>> GetJournalEntryByTenantAndEntryId(Guid tenantId, uint entryId);

        Task<BusinessLogicResponse<JournalEntry>> CreateJournalEntry(JournalEntry journalEntry);

        Task<BusinessLogicResponse<JournalEntry>> PostJournalEntry(
            Guid journalEntryId,
            DateTime postDate,
            Guid postedByUserId,
            string note = null);
    }
}
