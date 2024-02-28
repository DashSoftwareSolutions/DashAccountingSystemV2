using DashAccountingSystemV2.Models;

namespace DashAccountingSystemV2.BusinessLogic
{
    public interface IAccountBusinessLogic : IBusinessLogic
    {
        Task<BusinessLogicResponse<IEnumerable<AccountWithBalanceDto>>> GetAccounts(
            Guid tenantId,
            DateTime dateForAccountBalances);
    }
}
