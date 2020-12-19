using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using DashAccountingSystemV2.Data;
using DashAccountingSystemV2.Models;

namespace DashAccountingSystemV2.Repositories
{
    public class TenantRepository : ITenantRepository
    {
        private readonly ApplicationDbContext _db = null;

        public TenantRepository(ApplicationDbContext applicationDbContext)
        {
            _db = applicationDbContext;
        }

        public async Task<Tenant> GetTenantAsync(Guid tenantId)
        {
            return await _db
                .Tenant
                .FirstOrDefaultAsync(t => t.Id == tenantId);
        }

        public async Task<Tenant> GetTenantByNameAsync(string tenantName)
        {
            return await _db
                .Tenant
                .FirstOrDefaultAsync(t => t.Name.ToLower() == tenantName.ToLower());
        }

        public async Task<IEnumerable<Tenant>> GetTenantsAsync()
        {
            return await _db
                .Tenant
                .OrderBy(t => t.Name)
                .ToListAsync();
        }
    }
}
