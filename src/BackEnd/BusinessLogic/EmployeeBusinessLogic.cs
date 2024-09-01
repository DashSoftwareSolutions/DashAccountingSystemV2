using DashAccountingSystemV2.BackEnd.Models;
using DashAccountingSystemV2.BackEnd.Repositories;

namespace DashAccountingSystemV2.BackEnd.BusinessLogic
{
    public class EmployeeBusinessLogic : IEmployeeBusinessLogic
    {
        private readonly IEmployeeRepository _employeeRepository;
        private readonly ITenantRepository _tenantRepository;

        public EmployeeBusinessLogic(
            IEmployeeRepository employeeRepository,
            ITenantRepository tenantRepository)
        {
            _employeeRepository = employeeRepository;
            _tenantRepository = tenantRepository;
        }

        public async Task<BusinessLogicResponse<IEnumerable<Employee>>> GetByTenant(Guid tenantId, IEnumerable<uint>? employeeNumbers = null, bool onlyActive = true)
        {
            var tenant = await _tenantRepository.GetTenantAsync(tenantId);

            if (tenant == null)
            {
                return new BusinessLogicResponse<IEnumerable<Employee>>(ErrorType.RequestedEntityNotFound, "Tenant not found");
            }

            // TODO: Verify access to tenant and permission for listing employees

            var employees = await _employeeRepository.GetByTenantIdAsync(tenantId, employeeNumbers, onlyActive);

            return new BusinessLogicResponse<IEnumerable<Employee>>(employees);
        }
    }
}
