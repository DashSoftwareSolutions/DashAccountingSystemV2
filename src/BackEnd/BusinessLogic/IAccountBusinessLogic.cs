using DashAccountingSystemV2.BackEnd.Models;

namespace DashAccountingSystemV2.BackEnd.BusinessLogic
{
    public interface IAccountBusinessLogic : IBusinessLogic
    {
        Task<BusinessLogicResponse<IEnumerable<AccountWithBalanceDto>>> GetAccounts(
            Guid tenantId,
            DateTime dateForAccountBalances);
    }
}
