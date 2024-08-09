using DashAccountingSystemV2.BackEnd.Models;

namespace DashAccountingSystemV2.BackEnd.BusinessLogic
{
    public interface IProductBusinessLogic : IBusinessLogic
    {
        Task<BusinessLogicResponse<IEnumerable<Product>>> GetByTenant(Guid tenantId);

        // TODO: Add other methods as needed:
        // * Get by TenantAndCategory()
        // * GetDetailedById()
        // * CUD on both Categories and Products
    }
}
