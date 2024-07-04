using DashAccountingSystemV2.Models;
using DashAccountingSystemV2.Repositories;

namespace DashAccountingSystemV2.BusinessLogic
{
    public class JournalEntryBusinessLogic : IJournalEntryBusinessLogic
    {
        private readonly IJournalEntryRepository _journalEntryRepository;
        private readonly ITenantRepository _tenantRepository;
        private readonly ILogger _logger;

        public JournalEntryBusinessLogic(
            IJournalEntryRepository journalEntryRepository,
            ITenantRepository tenantRepository,
            ILogger<JournalEntryBusinessLogic> logger)
        {
            _journalEntryRepository = journalEntryRepository;
            _tenantRepository = tenantRepository;
            _logger = logger;
        }

        public async Task<BusinessLogicResponse<JournalEntry>> CreateJournalEntry(JournalEntry journalEntry)
        {
            var tenant = await _tenantRepository.GetTenantAsync(journalEntry.TenantId);

            // TODO: Verify user has access to this tenant and permission to create journal entries

            if (journalEntry == null)
                throw new ArgumentNullException(nameof(journalEntry));

            if (!journalEntry.IsBalanced)
                return new BusinessLogicResponse<JournalEntry>(
                    ErrorType.RequestNotValid,
                    "Journal Entry is not balanced!  It cannot be persisted in this state.");

            // TODO: For now, all transactions must be in the tenant's default asset type (currency) ... period.
            //       In a future phase, we will add support for foreign currency transactions, where we can also store foreign currency equivalent amounts and the conversion rate used.
            //       See https://github.com/DashSoftwareSolutions/DashAccountingSystemV2/issues/32
            if (journalEntry.Accounts.Any(a => a.AssetTypeId != tenant.DefaultAssetTypeId))
                return new BusinessLogicResponse<JournalEntry>(
                    ErrorType.RequestNotValid,
                    $"Journal Entry contains accounts with asset type ID {journalEntry.Accounts.First().AssetTypeId}.  This company only allows transactions with asset type ID {tenant.DefaultAssetTypeId} - {tenant.DefaultAssetType.Description} ({tenant.DefaultAssetType.Symbol}).");

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

        public async Task<BusinessLogicResponse<JournalEntry>> PostJournalEntry(
            Guid tenantId,
            uint entryId,
            DateTime postDate,
            Guid postedByUserId,
            string? note = null)
        {
            // TODO: Verify context user has access to the specified tenant and any other required permission
            var journalEntry = await _journalEntryRepository.GetByTenantAndEntryIdAsync(tenantId, entryId);

            if (journalEntry == null)
                return new BusinessLogicResponse<JournalEntry>(ErrorType.RequestedEntityNotFound);

            if (journalEntry.Status != TransactionStatus.Pending)
                return new BusinessLogicResponse<JournalEntry>(
                    ErrorType.RequestNotValid,
                    "Journal Entry is not in Pending Status so Posting it is not a valid operation");

            var updatedJounalEntry = await _journalEntryRepository.PostJournalEntryAsync(journalEntry.Id, postDate, postedByUserId, note);

            return new BusinessLogicResponse<JournalEntry>(updatedJounalEntry);
        }

        public async Task<BusinessLogicResponse<JournalEntry>> UpdateJournalEntry(JournalEntry journalEntry, Guid contextUserId)
        {
            var existingJournalEntry = await _journalEntryRepository.GetDetailedByIdAsync(journalEntry.Id);

            if (existingJournalEntry == null)
                return new BusinessLogicResponse<JournalEntry>(ErrorType.RequestedEntityNotFound);

            try
            {
                if (existingJournalEntry.Status == TransactionStatus.Posted)
                {
                    if (existingJournalEntry.Accounts.Any(a => a.Reconciled))
                    {
                        var updatedJournalEntry = await _journalEntryRepository.UpdateJournalEntryNoteOnlyAsync(journalEntry, contextUserId);
                        return new BusinessLogicResponse<JournalEntry>(updatedJournalEntry);
                    }
                    else
                    {
                        var updatedJournalEntry = await _journalEntryRepository.UpdateJournalEntryTopLevelMetadataAsync(journalEntry, contextUserId);
                        return new BusinessLogicResponse<JournalEntry>(updatedJournalEntry);
                    }
                }
                else
                {
                    if (!journalEntry.IsBalanced)
                        return new BusinessLogicResponse<JournalEntry>(
                            ErrorType.RequestNotValid,
                            "Journal Entry is not balanced!  It cannot be persisted in this state.");

                    // TODO: For now, all transactions must be in the tenant's default asset type (currency) ... period.
                    //       In a future phase, we will add support for foreign currency transactions, where we can also store foreign currency equivalent amounts and the conversion rate used.
                    //       See https://github.com/DashSoftwareSolutions/DashAccountingSystemV2/issues/32
                    if (journalEntry.Accounts.Any(a => a.AssetTypeId != existingJournalEntry.Tenant.DefaultAssetTypeId))
                        return new BusinessLogicResponse<JournalEntry>(
                            ErrorType.RequestNotValid,
                            $"Journal Entry contains accounts with asset type ID {journalEntry.Accounts.First().AssetTypeId}.  This company only allows transactions with asset type ID {existingJournalEntry.Tenant.DefaultAssetTypeId} - {existingJournalEntry.Tenant.DefaultAssetType.Description} ({existingJournalEntry.Tenant.DefaultAssetType.Symbol}).");

                    var entryWithUpdates = existingJournalEntry.Clone();
                    entryWithUpdates.EntryDate = journalEntry.EntryDate;
                    entryWithUpdates.PostDate = journalEntry.PostDate;
                    entryWithUpdates.Description = journalEntry.Description;
                    entryWithUpdates.CheckNumber = journalEntry.CheckNumber;
                    entryWithUpdates.Note = journalEntry.Note;
                    entryWithUpdates.Updated = DateTime.UtcNow;
                    entryWithUpdates.UpdatedById = contextUserId;

                    var accountsToAdd = journalEntry.Accounts.Except(existingJournalEntry.Accounts);
                    var accountsToRemove = existingJournalEntry.Accounts.Except(journalEntry.Accounts);
                    var accountsToUpdate = journalEntry.Accounts.Intersect(existingJournalEntry.Accounts);

                    foreach (var accountToRemove in accountsToRemove)
                        entryWithUpdates.Accounts.Remove(accountToRemove);

                    foreach (var accountToUpdate in accountsToUpdate)
                        entryWithUpdates.Accounts.Single(a => a.Equals(accountToUpdate)).Amount = accountToUpdate.Amount;

                    foreach (var accountToAdd in accountsToAdd)
                        entryWithUpdates.Accounts.Add(accountToAdd);


                    var updatedJournalEntry = await _journalEntryRepository.UpdateCompleteJournalEntryAsync(entryWithUpdates, contextUserId);
                    return new BusinessLogicResponse<JournalEntry>(updatedJournalEntry);
                }
            }
            catch (InvalidOperationException invalidOpEx)
            {
                return new BusinessLogicResponse<JournalEntry>(ErrorType.RequestNotValid, invalidOpEx);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Runtime exception while updating Journal Entry");
                return new BusinessLogicResponse<JournalEntry>(ErrorType.RuntimeException, "Runtime exception while updating Journal Entry");
            }
        }

        public async Task<BusinessLogicResponse> DeletePendingJournalEntryByTenantAndEntryId(Guid tenantId, uint entryId)
        {
            var existingJournalEntry = await _journalEntryRepository.GetByTenantAndEntryIdAsync(tenantId, entryId);

            if (existingJournalEntry == null)
                return new BusinessLogicResponse(ErrorType.RequestedEntityNotFound);

            if (existingJournalEntry.Status != TransactionStatus.Pending)
                return new BusinessLogicResponse(ErrorType.RequestNotValid, "Only Pending Journal Entries can be deleted");

            await _journalEntryRepository.DeletePendingByTenantAndEntryIdAsync(tenantId, entryId);

            return new BusinessLogicResponse();
        }
    }
}
