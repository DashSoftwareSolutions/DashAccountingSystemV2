using DashAccountingSystemV2.BackEnd.Models;
using DashAccountingSystemV2.BackEnd.Repositories;

namespace DashAccountingSystemV2.BackEnd.BusinessLogic
{
    public class TenantBusinessLogic : ITenantBusinessLogic
    {
        private readonly ITenantRepository _tenantRepository;

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
