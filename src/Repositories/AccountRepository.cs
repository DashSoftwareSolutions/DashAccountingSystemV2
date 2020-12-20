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
    public class AccountRepository : IAccountRepository
    {
        private readonly ApplicationDbContext _db = null;

        public AccountRepository(ApplicationDbContext applicationDbContext)
        {
            _db = applicationDbContext;
        }

        public async Task<Account> CreateAccountAsync(Account account)
        {
            await _db.Account.AddAsync(account);
            await _db.SaveChangesAsync();
            return await GetAccountByIdAsync(account.Id);
        }

        public Task<decimal> GetAccountBalanceAsync(Guid accountId, DateTime date)
        {
            return _db.JournalEntryAccount
                .Include(jeAcct => jeAcct.JournalEntry)
                .Where(jeAcct =>
                    jeAcct.AccountId == accountId &&
                    jeAcct.JournalEntry.Status == TransactionStatus.Posted &&
                    jeAcct.JournalEntry.PostDate <= date)
                .SumAsync(jeAcct => jeAcct.Amount);
        }

        public Task<Account> GetAccountByIdAsync(Guid accountId)
        {
            return _db
                .Account
                .Include(a => a.AccountType)
                .Include(a => a.AssetType)
                .Include(a => a.Tenant)
                .Include(a => a.CreatedBy)
                .Include(a => a.UpdatedBy)
                .FirstOrDefaultAsync(a => a.Id == accountId);
        }

        public async Task<IEnumerable<Account>> GetAccountsByTenantAsync(Guid tenantId)
        {
            return await _db
                .Account
                .Where(a => a.TenantId == tenantId)
                .Include(a => a.AccountType)
                .Include(a => a.AssetType)
                .Include(a => a.Tenant)
                .OrderBy(a => a.AccountTypeId)
                .ThenBy(a => a.AccountNumber)
                .ToListAsync();
        }

        public async Task<IEnumerable<JournalEntryAccount>> GetPendingTransactionsAsync(Guid accountId)
        {
            return await _db
                .JournalEntryAccount
                .Include(jeAcct => jeAcct.JournalEntry)
                .Where(jeAcct =>
                    jeAcct.AccountId == accountId &&
                    jeAcct.JournalEntry.Status == TransactionStatus.Pending)
                .OrderByDescending(jeAcct => jeAcct.JournalEntry.EntryDate)
                .ThenBy(jeAcct => jeAcct.JournalEntry.EntryId)
                .Include(jeAcct => jeAcct.JournalEntry.CreatedBy)
                .Include(jeAcct => jeAcct.JournalEntry.UpdatedBy)
                .ToListAsync();
        }

        public async Task<PagedResult<JournalEntryAccount>> GetPostedTransactionsAsync(Guid accountId, DateTime dateRangeStart, DateTime dateRangeEnd, Pagination pagination)
        {
            return await _db
                .JournalEntryAccount
                .Include(jeAcct => jeAcct.JournalEntry)
                .Where(jeAcct =>
                    jeAcct.AccountId == accountId &&
                    jeAcct.JournalEntry.Status == TransactionStatus.Posted &&
                    jeAcct.JournalEntry.PostDate.HasValue &&
                    jeAcct.JournalEntry.PostDate >= dateRangeStart &&
                    jeAcct.JournalEntry.PostDate <= dateRangeEnd)
                .OrderByDescending(jeAcct => jeAcct.JournalEntry.PostDate) // TODO: Honor other sorting options if needed
                .ThenBy(jeAcct => jeAcct.JournalEntry.EntryId)
                .Include(jeAcct => jeAcct.JournalEntry.CreatedBy)
                .Include(jeAcct => jeAcct.JournalEntry.UpdatedBy)
                .Include(jeAcct => jeAcct.JournalEntry.PostedBy)
                .GetPagedAsync(pagination);
        }
    }
}
