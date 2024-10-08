using DashAccountingSystemV2.BackEnd.Models;

namespace DashAccountingSystemV2.BackEnd.Repositories
{
    public interface IEmployeeRepository
    {
        Task<IEnumerable<Employee>> GetByTenantIdAsync(
            Guid tenantId,
            IEnumerable<uint>? employeeNumbers = null,
            bool onlyActive = true);

        Task<Employee> GetByEntityIdAsync(Guid entityId);

        Task<Employee> GetByUserIdAsync(Guid tenantId, Guid userId);

        Task<Employee> InsertAsync(Employee employee);

        Task<Employee> UpdateAsync(Employee employee);
    }
}
