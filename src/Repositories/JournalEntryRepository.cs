using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using DashAccountingSystemV2.Data;
using DashAccountingSystemV2.Extensions;
using DashAccountingSystemV2.Models;

namespace DashAccountingSystemV2.Repositories
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

            // TODO: Is this check appropriate here?
            //       Is there _ever_ a case when it is okay to have an unbalanced transaction?
            //       Is this the responsibility of a business logic layer?
            if (!entry.IsBalanced)
                throw new ArgumentException(
                    "Journal Entry is not balanced!  It cannot be persisted in this state.",
                    nameof(entry));

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

            throw new NotImplementedException();
        }

        public Task<JournalEntry> GetByIdAsync(Guid journalEntryId)
        {
            return _db
                .JournalEntry
                .Where(je => je.Id == journalEntryId)
                .Include(je => je.Tenant)
                .SingleOrDefaultAsync();
        }

        public Task<JournalEntry> GetByTenantAndEntryIdAsync(Guid tenantId, int entryId)
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
                .Include(je => je.CreatedBy)
                .Include(je => je.UpdatedBy)
                .Include(je => je.PostedBy)
                .Include(je => je.CanceledBy)
                .Include(je => je.Accounts)
                    .ThenInclude(jeAcct => jeAcct.Account)
                .Include(je => je.Accounts)
                    .ThenInclude(jeAcct => jeAcct.AssetType)
                .SingleOrDefaultAsync();
        }

        public Task<JournalEntry> GetDetailedByTenantAndEntryIdAsync(Guid tenantId, int entryId)
        {
            throw new NotImplementedException();
        }

        public Task<PagedResult<JournalEntry>> GetJournalEntriesAsync(Guid tenantId, DateTime dateRangeStart, DateTime dateRangeEnd, Pagination pagination)
        {
            throw new NotImplementedException();
        }

        public Task<uint> GetNextEntryIdAsync(Guid tenantId)
        {
            throw new NotImplementedException();
        }

        public Task<PagedResult<JournalEntry>> GetPendingJournalEntriesAsync(Guid tenantId, Pagination pagination)
        {
            throw new NotImplementedException();
        }

        public Task<JournalEntry> PostJournalEntryAsync(Guid journalEntryId, DateTime postDate, Guid postedByUserId, string note = null)
        {
            throw new NotImplementedException();
        }
    }
}
