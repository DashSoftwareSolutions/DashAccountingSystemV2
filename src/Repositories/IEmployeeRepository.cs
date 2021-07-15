using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using DashAccountingSystemV2.Models;

namespace DashAccountingSystemV2.Repositories
{
    public interface IEmployeeRepository
    {
        Task<IEnumerable<Employee>> GetByTenantIdAsync(
            Guid tenantId,
            IEnumerable<uint> employeeNumbers = null,
            bool onlyActive = true);

        Task<Employee> GetByEntityIdAsync(Guid entityId);

        Task<Employee> GetByUserIdAsync(Guid tenantId, Guid userId);

        Task<Employee> InsertAsync(Employee employee);

        Task<Employee> UpdateAsync(Employee employee);
    }
}
