using Microsoft.EntityFrameworkCore;
using Dapper;
using Npgsql;
using DashAccountingSystemV2.BackEnd.Data;
using DashAccountingSystemV2.BackEnd.Extensions;
using DashAccountingSystemV2.BackEnd.Models;

namespace DashAccountingSystemV2.BackEnd.Repositories
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

        public async Task<Dictionary<Guid, decimal>> GetAccountBalancesAsync(
            Guid tenantId,
            DateTime date,
            KnownAccountType[] accountTypes = null)
        {
            using (var connection = new NpgsqlConnection(_db.Database.GetConnectionString()))
            {
                var results = await connection.QueryAsync<AccountBalanceDto>($@"
WITH transactions AS (
      SELECT je_acct.""AccountId""
            ,je_acct.""Amount""
        FROM ""JournalEntryAccount"" je_acct
             INNER JOIN ""JournalEntry"" je
                     ON je_acct.""JournalEntryId"" = je.""Id""
             INNER JOIN ""Account"" a
                     ON je_acct.""AccountId"" = a.""Id""
       WHERE je.""TenantId"" = @tenantId
         AND ( @accountTypes::INTEGER[] IS NULL OR a.""AccountTypeId"" = ANY ( @accountTypes ) )
         AND je.""Status"" = {(int)TransactionStatus.Posted}
         AND je.""PostDate"" <= @date
)
  SELECT acct.""Id"" AS ""AccountId""
        ,COALESCE(SUM(tx.""Amount""), 0) AS ""Balance""
    FROM ""Account"" acct
         LEFT JOIN transactions tx
                ON acct.""Id"" = tx.""AccountId""
   WHERE acct.""TenantId"" = @tenantId
     AND ( @accountTypes::INTEGER[] IS NULL OR acct.""AccountTypeId"" = ANY ( @accountTypes ) )
GROUP BY acct.""Id""
ORDER BY acct.""AccountNumber"";
",
                        new
                        {
                            tenantId,
                            date,
                            accountTypes = accountTypes == null ? null : accountTypes.Cast<int>().ToArray(),
                        }
                    );

                return results.ToDictionary(x => x.AccountId, x => x.Balance);
            }
        }

        public async Task<Dictionary<Guid, decimal>> GetAccountBalancesAsync(
            Guid tenantId,
            DateTime dateRangeStart,
            DateTime dateRangeEnd,
            KnownAccountType[] accountTypes = null)
        {
            using (var connection = new NpgsqlConnection(_db.Database.GetConnectionString()))
            {
                var results = await connection.QueryAsync<AccountBalanceDto>($@"
WITH transactions AS (
      SELECT je_acct.""AccountId""
            ,je_acct.""Amount""
        FROM ""JournalEntryAccount"" je_acct
             INNER JOIN ""JournalEntry"" je
                     ON je_acct.""JournalEntryId"" = je.""Id""
             INNER JOIN ""Account"" a
                     ON je_acct.""AccountId"" = a.""Id""
       WHERE je.""TenantId"" = @tenantId
         AND ( @accountTypes::INTEGER[] IS NULL OR a.""AccountTypeId"" = ANY ( @accountTypes ) )
         AND je.""Status"" = {(int)TransactionStatus.Posted}
         AND je.""PostDate"" >= @dateRangeStart
         AND je.""PostDate"" <= @dateRangeEnd
)
  SELECT acct.""Id"" AS ""AccountId""
        ,COALESCE(SUM(tx.""Amount""), 0) AS ""Balance""
    FROM ""Account"" acct
         LEFT JOIN transactions tx
                ON acct.""Id"" = tx.""AccountId""
   WHERE acct.""TenantId"" = @tenantId
     AND ( @accountTypes::INTEGER[] IS NULL OR acct.""AccountTypeId"" = ANY ( @accountTypes ) )
GROUP BY acct.""Id""
ORDER BY acct.""AccountNumber"";
",
                        new
                        {
                            tenantId,
                            dateRangeStart,
                            dateRangeEnd,
                            accountTypes = accountTypes == null ? null : accountTypes.Cast<int>().ToArray(),
                        }
                    );

                return results.ToDictionary(x => x.AccountId, x => x.Balance);
            }
        }

        public Task<Account> GetAccountByIdAsync(Guid accountId)
        {
            return _db
                .Account
                .Include(a => a.AccountType)
                .Include(a => a.AccountSubType)
                .Include(a => a.AssetType)
                .Include(a => a.Tenant)
                .Include(a => a.CreatedBy)
                .Include(a => a.UpdatedBy)
                .FirstOrDefaultAsync(a => a.Id == accountId);
        }

        public async Task<IEnumerable<Account>> GetAccountsByTenantAsync(
            Guid tenantId,
            KnownAccountType[] accountTypes = null)
        {
            var accountTypeIds = accountTypes == null ? null : accountTypes.Cast<int>().ToArray();

            return await _db
                .Account
                .Where(a => a.TenantId == tenantId)
                .Include(a => a.AccountType)
                .Include(a => a.AccountSubType)
                .Include(a => a.AssetType)
                .Include(a => a.Tenant)
                .Where(a => accountTypes == null || accountTypeIds.Contains(a.AccountTypeId))
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
