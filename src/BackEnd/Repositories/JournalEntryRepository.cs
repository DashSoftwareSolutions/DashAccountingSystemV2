using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using DashAccountingSystemV2.BackEnd.Data;
using DashAccountingSystemV2.BackEnd.Extensions;
using DashAccountingSystemV2.BackEnd.Models;

namespace DashAccountingSystemV2.BackEnd.Repositories
{
    public class JournalEntryRepository : IJournalEntryRepository
    {
        private readonly ApplicationDbContext _db = null;

        public JournalEntryRepository(ApplicationDbContext applicationDbContext)
        {
            _db = applicationDbContext;
        }

        public async Task<JournalEntry> CreateJournalEntryAsync(JournalEntry entry)
        {
            if (entry == null)
                throw new ArgumentNullException(nameof(entry), "Journal Entry cannot be null");

            using (var transaction = await _db.Database.BeginTransactionAsync())
            {
                try
                {
                    var tenant = await _db.Tenant.FirstOrDefaultAsync(t => t.Id == entry.TenantId);

                    if (tenant == null)
                        throw new ArgumentException(
                            $"Journal Entry specifies a non-existent Tenant (ID {entry.TenantId}).",
                            nameof(entry));

                    if (entry.EntryId == 0)
                    {
                        entry.EntryId = await GetNextEntryIdAsync(entry.TenantId);
                    }

                    await _db.JournalEntry.AddAsync(entry);
                    await _db.SaveChangesAsync();
                    await transaction.CommitAsync();

                    return await GetDetailedByIdAsync(entry.Id);
                }
                catch (Exception)
                {
                    await transaction.RollbackAsync();
                    throw;
                }
            }
        }

        public Task<JournalEntry> GetByIdAsync(Guid journalEntryId)
        {
            return _db
                .JournalEntry
                .Where(je => je.Id == journalEntryId)
                .Include(je => je.Tenant)
                .SingleOrDefaultAsync();
        }

        public Task<JournalEntry> GetByTenantAndEntryIdAsync(Guid tenantId, uint entryId)
        {
            return _db
                .JournalEntry
                .Where(je => je.TenantId == tenantId && je.EntryId == entryId)
                .Include(je => je.Tenant)
                .SingleOrDefaultAsync();
        }

        public Task<JournalEntry> GetDetailedByIdAsync(Guid journalEntryId)
        {
            return _db
                .JournalEntry
                .Where(je => je.Id == journalEntryId)
                .Include(je => je.Tenant)
                .Include(je => je.Tenant.DefaultAssetType)
                .Include(je => je.CreatedBy)
                .Include(je => je.UpdatedBy)
                .Include(je => je.PostedBy)
                .Include(je => je.Accounts)
                    .ThenInclude(jeAcct => jeAcct.Account)
                .Include(je => je.Accounts)
                    .ThenInclude(jeAcct => jeAcct.AssetType)
                .SingleOrDefaultAsync();
        }

        public Task<JournalEntry> GetDetailedByTenantAndEntryIdAsync(Guid tenantId, uint entryId)
        {
            return _db
                .JournalEntry
                .Where(je =>
                    je.TenantId == tenantId &&
                    je.EntryId == entryId
                )
                .Include(je => je.Tenant)
                .Include(je => je.Tenant.DefaultAssetType)
                .Include(je => je.CreatedBy)
                .Include(je => je.UpdatedBy)
                .Include(je => je.PostedBy)
                .Include(je => je.Accounts)
                    .ThenInclude(jeAcct => jeAcct.Account)
                .Include(je => je.Accounts)
                    .ThenInclude(jeAcct => jeAcct.AssetType)
                .SingleOrDefaultAsync();
        }

        public Task<PagedResult<JournalEntry>> GetJournalEntriesAsync(
            Guid tenantId,
            DateTime dateRangeStart,
            DateTime dateRangeEnd,
            Pagination pagination)
        {
            var dateRangeStartWithoutKind = dateRangeStart.Unkind();
            var dateRangeEndWithoutKind = dateRangeEnd.Unkind();

            return _db
                .JournalEntry
                .Where(je =>
                    je.TenantId == tenantId &&
                    (je.PostDate ?? je.EntryDate) >= dateRangeStartWithoutKind &&
                    (je.PostDate ?? je.EntryDate) <= dateRangeEndWithoutKind
                )
                .OrderByDescending(je => je.PostDate ?? je.EntryDate) // TODO: Honor other sorting options if needed
                .ThenBy(je => je.EntryId)
                .Include(je => je.CreatedBy)
                .Include(je => je.PostedBy)
                .Include(je => je.Accounts)
                    .ThenInclude(jeAcct => jeAcct.Account)
                .Include(je => je.Accounts)
                    .ThenInclude(jeAcct => jeAcct.AssetType)
                .GetPagedAsync(pagination);
        }

        public async Task<IEnumerable<JournalEntryAccount>> GetJournalEntryAccountsAsync(
            Guid tenantId,
            DateTime dateRangeStart,
            DateTime dateRangeEnd)
        {
            var dateRangeStartWithoutKind = dateRangeStart.Unkind();
            var dateRangeEndWithoutKind = dateRangeEnd.Unkind();

            return await _db
                .JournalEntryAccount
                .Include(jeAcct => jeAcct.JournalEntry)
                .Include(jeAcct => jeAcct.Account)
                .Where(jeAcct =>
                    jeAcct.JournalEntry.TenantId == tenantId &&
                    (jeAcct.JournalEntry.PostDate ?? jeAcct.JournalEntry.EntryDate) >= dateRangeStartWithoutKind &&
                    (jeAcct.JournalEntry.PostDate ?? jeAcct.JournalEntry.EntryDate) <= dateRangeEndWithoutKind)
                .OrderBy(jeAcct => jeAcct.Account.AccountTypeId)
                .ThenBy(jeAcct => jeAcct.JournalEntry.Status != TransactionStatus.Pending ? 1 : 2)
                .ThenBy(jeAcct => jeAcct.JournalEntry.PostDate ?? jeAcct.JournalEntry.EntryDate)
                .ThenBy(jeAcct => jeAcct.JournalEntry.EntryId)
                .Include(jeAcct => jeAcct.JournalEntry.CreatedBy)
                .Include(jeAcct => jeAcct.JournalEntry.UpdatedBy)
                .ToListAsync();
        }

        public async Task<IEnumerable<JournalEntryAccount>> GetPostedJournalEntryAccountsAsync(
            Guid tenantId,
            DateTime dateRangeStart,
            DateTime dateRangeEnd,
            params KnownAccountType[] accountTypes)
        {
            var accountTypeIds = accountTypes == null ? null : accountTypes.Cast<int>().ToArray();

            return await _db
                .JournalEntryAccount
                .Include(jeAcct => jeAcct.JournalEntry)
                .Include(jeAcct => jeAcct.Account)
                .Where(jeAcct =>
                    jeAcct.JournalEntry.TenantId == tenantId &&
                    (accountTypes == null || accountTypeIds.Contains(jeAcct.Account.AccountTypeId)) &&
                    jeAcct.JournalEntry.Status == TransactionStatus.Posted &&
                    jeAcct.JournalEntry.PostDate.HasValue &&
                    jeAcct.JournalEntry.PostDate >= dateRangeStart &&
                    jeAcct.JournalEntry.PostDate <= dateRangeEnd)
                .OrderBy(jeAcct => jeAcct.Account.AccountTypeId)
                .ThenBy(jeAcct => jeAcct.JournalEntry.Status != TransactionStatus.Pending ? 1 : 2)
                .ThenBy(jeAcct => jeAcct.JournalEntry.PostDate ?? jeAcct.JournalEntry.EntryDate)
                .ThenBy(jeAcct => jeAcct.JournalEntry.EntryId)
                .Include(jeAcct => jeAcct.JournalEntry.CreatedBy)
                .Include(jeAcct => jeAcct.JournalEntry.UpdatedBy)
                .ToListAsync();
        }

        public async Task<uint> GetNextEntryIdAsync(Guid tenantId)
        {
            var maxCurrentEntryId = await _db
                .JournalEntry
                .Where(je => je.TenantId == tenantId)
                .Select(je => je.EntryId)
                .MaxAsync<uint, uint?>(entryId => entryId) ?? 0;

            return ++maxCurrentEntryId;
        }

        public Task<PagedResult<JournalEntry>> GetPendingJournalEntriesAsync(Guid tenantId, Pagination pagination)
        {
            return _db
                .JournalEntry
                .Where(je =>
                    je.TenantId == tenantId &&
                    je.Status == TransactionStatus.Pending
                )
                .OrderByDescending(je => je.EntryDate) // TODO: Honor other sorting options if needed
                .ThenBy(je => je.EntryId)
                .Include(je => je.CreatedBy)
                .Include(je => je.PostedBy)
                .Include(je => je.Accounts)
                    .ThenInclude(jeAcct => jeAcct.Account)
                .Include(je => je.Accounts)
                    .ThenInclude(jeAcct => jeAcct.AssetType)
                .GetPagedAsync(pagination);
        }

        public async Task<JournalEntry> PostJournalEntryAsync(Guid journalEntryId, DateTime postDate, Guid postedByUserId, string note = null)
        {
            var entry = await GetByIdAsync(journalEntryId);

            if (entry == null)
                return null;

            entry.PostDate = postDate.Unkind();
            entry.PostedById = postedByUserId;
            entry.Status = TransactionStatus.Posted;
            entry.Updated = DateTime.UtcNow.Unkind();
            entry.UpdatedById = postedByUserId;

            if (!string.IsNullOrWhiteSpace(note) && !string.Equals(note, entry.Note))
            {
                entry.Note = note;
            }

            await _db.SaveChangesAsync();

            return await GetDetailedByIdAsync(journalEntryId);
        }

        public async Task<JournalEntry> UpdateCompleteJournalEntryAsync(JournalEntry journalEntry, Guid contextUserId)
        {
            var existingEntry = await GetDetailedByIdAsync(journalEntry.Id);
            if (existingEntry == null)
                return null;

            if (existingEntry.Status == TransactionStatus.Pending && journalEntry.PostDate.HasValue)
                throw new InvalidOperationException("The \'Post Journal Entry\' method should be used instead to move a Journal Entry from Pending to Posted Status");

            if (existingEntry.Status == TransactionStatus.Posted && !journalEntry.PostDate.HasValue)
                throw new InvalidOperationException("It is not permitted to remove the Post Date of a Posted Journal Entry");

            using (var transaction = await _db.Database.BeginTransactionAsync())
            {
                try
                {
                    existingEntry.EntryDate = journalEntry.EntryDate;
                    existingEntry.PostDate = journalEntry.PostDate;
                    existingEntry.Description = journalEntry.Description;
                    existingEntry.CheckNumber = journalEntry.CheckNumber;
                    existingEntry.Note = journalEntry.Note;
                    existingEntry.Updated = DateTime.UtcNow.Unkind();
                    existingEntry.UpdatedById = contextUserId;
                    existingEntry.Accounts = journalEntry.Accounts;

                    await _db.SaveChangesAsync();
                    await transaction.CommitAsync();

                    return await GetDetailedByIdAsync(journalEntry.Id);
                }
                catch (Exception)
                {
                    await transaction.RollbackAsync();
                    throw;
                }
            }
        }

        public async Task<JournalEntry> UpdateJournalEntryNoteOnlyAsync(JournalEntry journalEntry, Guid contextUserId)
        {
            var existingEntry = await GetByIdAsync(journalEntry.Id);
            if (existingEntry == null)
                return null;

            existingEntry.Note = journalEntry.Note;

            await _db.SaveChangesAsync();

            return await GetDetailedByIdAsync(journalEntry.Id);
        }

        public async Task<JournalEntry> UpdateJournalEntryTopLevelMetadataAsync(JournalEntry journalEntry, Guid contextUserId)
        {
            var existingEntry = await GetByIdAsync(journalEntry.Id);

            if (existingEntry == null)
                return null;

            if (existingEntry.Status == TransactionStatus.Pending && journalEntry.PostDate.HasValue)
                throw new InvalidOperationException("The \'Post Journal Entry\' method should be used instead to move a Journal Entry from Pending to Posted Status");

            if (existingEntry.Status == TransactionStatus.Posted && !journalEntry.PostDate.HasValue)
                throw new InvalidOperationException("It is not permitted to remove the Post Date of a Posted Journal Entry");

            existingEntry.EntryDate = journalEntry.EntryDate;
            existingEntry.PostDate = journalEntry.PostDate;
            existingEntry.Description = journalEntry.Description;
            existingEntry.CheckNumber = journalEntry.CheckNumber;
            existingEntry.Note = journalEntry.Note;
            existingEntry.Updated = DateTime.UtcNow.Unkind();
            existingEntry.UpdatedById = contextUserId;

            await _db.SaveChangesAsync();

            return await GetDetailedByIdAsync(journalEntry.Id);
        }

        public async Task DeletePendingByTenantAndEntryIdAsync(Guid tenantId, uint entryId)
        {
            var entryToDelete = await GetByTenantAndEntryIdAsync(tenantId, entryId);

            if (entryToDelete == null)
                return;

            if (entryToDelete.Status != TransactionStatus.Pending)
                return;

            _db.JournalEntry.Remove(entryToDelete);
            await _db.SaveChangesAsync();
        }
    }
}
