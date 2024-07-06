using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using DashAccountingSystemV2.BackEnd.Models;

namespace DashAccountingSystemV2.BackEnd.Repositories
{
    public interface ITenantRepository
    {
        /// <summary>
        /// Lighter-weight call to just get top-level details.  Intended to verify Tenant existence.
        /// </summary>
        /// <param name="tenantId"></param>
        /// <returns></returns>
        Task<Tenant> GetTenantAsync(Guid tenantId);

        /// <summary>
        /// Heavier call that also hydrates Tenant mailing address.
        /// </summary>
        /// <param name="tenantId"></param>
        /// <returns></returns>
        Task<Tenant> GetTenantDetailedAsync(Guid tenantId);

        /// <summary>
        /// Lighter-weight call to just get top-level details.  Intended to verify Tenant existence.
        /// </summary>
        /// <param name="tenantName"></param>
        /// <returns></returns>
        Task<Tenant> GetTenantByNameAsync(string tenantName);

        /// <summary>
        /// Heavier call that also hydrates Tenant mailing address.
        /// </summary>
        /// <param name="tenantName"></param>
        /// <returns></returns>
        Task<Tenant> GetTenantDetailedByNameAsync(string tenantName);

        /// <summary>
        /// Gets a list of Tenants.  Top-level metadata only.
        /// </summary>
        /// <returns></returns>
        Task<IEnumerable<Tenant>> GetTenantsAsync();
    }
}
