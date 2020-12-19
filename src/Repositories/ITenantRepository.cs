using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using DashAccountingSystemV2.Models;

namespace DashAccountingSystemV2.Repositories
{
    public interface ITenantRepository
    {
        Task<Tenant> GetTenantAsync(Guid tenantId);
        Task<Tenant> GetTenantByNameAsync(string tenantName);
        Task<IEnumerable<Tenant>> GetTenantsAsync();
    }
}
