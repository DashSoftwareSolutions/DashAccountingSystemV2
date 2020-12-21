using System.Collections.Generic;
using System.Threading.Tasks;
using DashAccountingSystemV2.Models;
using DashAccountingSystemV2.Repositories;

namespace DashAccountingSystemV2.BusinessLogic
{
    public class TenantBusinessLogic : ITenantBusinessLogic
    {
        private readonly ITenantRepository _tenantRepository = null;

        public TenantBusinessLogic(ITenantRepository tenantRepository)
        {
            _tenantRepository = tenantRepository;
        }

        public async Task<BusinessLogicResponse<IEnumerable<Tenant>>> GetTenants()
        {
            var tenants = await _tenantRepository.GetTenantsAsync();
            return new BusinessLogicResponse<IEnumerable<Tenant>>(tenants);
        }
    }
}
