using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using DashAccountingSystemV2.BackEnd.Models;

namespace DashAccountingSystemV2.BackEnd.Repositories
{
    public interface IAccountRepository
    {
        Task<Account> CreateAccountAsync(Account account);

        Task<IEnumerable<Account>> GetAccountsByTenantAsync(
            Guid tenantId,
            KnownAccountType[] accountTypes = null);

        Task<Account> GetAccountByIdAsync(Guid accountId);

        Task<decimal> GetAccountBalanceAsync(Guid accountId, DateTime date);

        Task<Dictionary<Guid, decimal>> GetAccountBalancesAsync(
            Guid tenantId,
            DateTime date,
            KnownAccountType[] accountTypes = null);

        Task<Dictionary<Guid, decimal>> GetAccountBalancesAsync(
            Guid tenantId,
            DateTime dateRangeStart,
            DateTime dateRangeEnd,
            KnownAccountType[] accountTypes = null);

        Task<IEnumerable<JournalEntryAccount>> GetPendingTransactionsAsync(Guid accountId);

        Task<PagedResult<JournalEntryAccount>> GetPostedTransactionsAsync(
            Guid accountId,
            DateTime dateRangeStart,
            DateTime dateRangeEnd,
            Pagination pagination);
    }
}
