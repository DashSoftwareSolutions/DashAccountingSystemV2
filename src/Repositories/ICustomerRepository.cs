using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using DashAccountingSystemV2.Models;

namespace DashAccountingSystemV2.Repositories
{
    public interface ICustomerRepository
    {
        Task<IEnumerable<Customer>> GetByTenantIdAsync(Guid tenantId, bool onlyActive = true);

        Task<Customer> GetByEntityIdAsync(Guid entityId);

        Task<Customer> InsertAsync(Customer customer);

        Task<Customer> UpdateAsync(Customer customer);
    }
}
