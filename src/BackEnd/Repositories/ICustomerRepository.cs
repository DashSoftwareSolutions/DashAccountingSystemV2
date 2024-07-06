using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using DashAccountingSystemV2.BackEnd.Models;

namespace DashAccountingSystemV2.BackEnd.Repositories
{
    public interface ICustomerRepository
    {
        Task<IEnumerable<Customer>> GetByTenantIdAsync(
            Guid tenantId,
            IEnumerable<string> customerNumbers = null,
            bool onlyActive = true);

        Task<Customer> GetByEntityIdAsync(Guid entityId);

        Task<Customer> GetByTenantIdAndCustomerNumberAsync(Guid tenantId, string customerNumber);

        Task<Customer> InsertAsync(Customer customer);

        Task<Customer> UpdateAsync(Customer customer);
    }
}
