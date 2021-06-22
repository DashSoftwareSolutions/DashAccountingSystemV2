using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DashAccountingSystemV2.Extensions;
using DashAccountingSystemV2.Models;
using DashAccountingSystemV2.Repositories;

namespace DashAccountingSystemV2.BusinessLogic
{
    public class JournalEntryBusinessLogic : IJournalEntryBusinessLogic
    {
        private readonly IJournalEntryRepository _journalEntryRepository = null;

        public JournalEntryBusinessLogic(IJournalEntryRepository journalEntryRepository)
        {
            _journalEntryRepository = journalEntryRepository;
        }

        public async Task<BusinessLogicResponse<JournalEntry>> CreateJournalEntry(JournalEntry journalEntry)
        {
            // TODO: Permissions/Authorization checks

            if (journalEntry == null)
                throw new ArgumentNullException(nameof(journalEntry));

            if (!journalEntry.IsBalanced)
                return new BusinessLogicResponse<JournalEntry>(
                    ErrorType.RequestNotValid,
                    "Journal Entry is not balanced!  It cannot be persisted in this state.");

            try
            {
                var savedJournalEntry = await _journalEntryRepository.CreateJournalEntryAsync(journalEntry);
                return new BusinessLogicResponse<JournalEntry>(savedJournalEntry);
            }
            catch (ArgumentException argEx)
            {
                return new BusinessLogicResponse<JournalEntry>(ErrorType.RequestNotValid, argEx.Message);
            }
            catch (Exception)
            {
                return new BusinessLogicResponse<JournalEntry>(ErrorType.RuntimeException);
            }
        }

        public async Task<BusinessLogicResponse<JournalEntry>> GetJournalEntryByTenantAndEntryId(Guid tenantId, uint entryId)
        {
            // TODO: Verify context user has access to the specified tenant and any other required permission
            var journalEntry = await _journalEntryRepository.GetDetailedByTenantAndEntryIdAsync(tenantId, entryId);

            if (journalEntry == null)
                return new BusinessLogicResponse<JournalEntry>(ErrorType.RequestedEntityNotFound);

            return new BusinessLogicResponse<JournalEntry>(journalEntry);
        }

        public Task<BusinessLogicResponse<JournalEntry>> PostJournalEntry(Guid journalEntryId, DateTime postDate, Guid postedByUserId, string note = null)
        {
            throw new NotImplementedException();
        }
    }
}
