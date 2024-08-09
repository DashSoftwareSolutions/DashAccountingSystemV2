using DashAccountingSystemV2.BackEnd.Models;

namespace DashAccountingSystemV2.BackEnd.BusinessLogic
{
    public interface ITenantBusinessLogic : IBusinessLogic
    {
        Task<BusinessLogicResponse<IEnumerable<Tenant>>> GetTenants();
    }
}
