using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using DashAccountingSystemV2.Models;

namespace DashAccountingSystemV2.BusinessLogic
{
    public interface IProductBusinessLogic : IBusinessLogic
    {
        Task<BusinessLogicResponse<IEnumerable<Product>>> GetByTenant(Guid tenantId);

        // TODO: Add other methods as needed:
        // * Get by TenantAndCategory()
        // * GetDetaildById()
        // * CUD on both Categories and Products
    }
}
