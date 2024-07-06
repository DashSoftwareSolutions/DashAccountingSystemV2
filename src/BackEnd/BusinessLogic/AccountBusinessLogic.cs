using DashAccountingSystemV2.BackEnd.Models;
using DashAccountingSystemV2.BackEnd.Repositories;

namespace DashAccountingSystemV2.BackEnd.BusinessLogic
{
    public class AccountBusinessLogic : IAccountBusinessLogic
    {
        private readonly IAccountRepository _accountRepository = null;

        public AccountBusinessLogic(IAccountRepository accountRepository)
        {
            _accountRepository = accountRepository;
        }

        public async Task<BusinessLogicResponse<IEnumerable<AccountWithBalanceDto>>> GetAccounts(Guid tenantId, DateTime dateForAccountBalances)
        {
            var accounts = await _accountRepository.GetAccountsByTenantAsync(tenantId);
            var accountBalances = await _accountRepository.GetAccountBalancesAsync(tenantId, dateForAccountBalances);

            var results = accounts.Select(a => new AccountWithBalanceDto()
            {
                Account = a,
                CurrentBalance = accountBalances[a.Id],
            });

            return new BusinessLogicResponse<IEnumerable<AccountWithBalanceDto>>(results);
        }
    }
}
