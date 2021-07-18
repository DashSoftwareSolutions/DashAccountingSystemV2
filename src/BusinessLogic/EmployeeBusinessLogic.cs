using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using DashAccountingSystemV2.Models;
using DashAccountingSystemV2.Repositories;

namespace DashAccountingSystemV2.BusinessLogic
{
    public class EmployeeBusinessLogic : IEmployeeBusinessLogic
    {
        private readonly IEmployeeRepository _employeeRepository = null;
        private readonly ITenantRepository _tenantRepository = null;

        public EmployeeBusinessLogic(
            IEmployeeRepository employeeRepository,
            ITenantRepository tenantRepository)
        {
            _employeeRepository = employeeRepository;
            _tenantRepository = tenantRepository;
        }

        public async Task<BusinessLogicResponse<IEnumerable<Employee>>> GetByTenant(Guid tenantId, IEnumerable<uint> employeeNumbers = null, bool onlyActive = true)
        {
            var tenant = await _tenantRepository.GetTenantAsync(tenantId);

            if (tenant == null)
            {
                return new BusinessLogicResponse<IEnumerable<Employee>>(ErrorType.RequestedEntityNotFound, "Tenant not found");
            }

            // TODO: Verify access to tenant and permission for listing customers

            var employees = await _employeeRepository.GetByTenantIdAsync(tenantId, employeeNumbers, onlyActive);

            return new BusinessLogicResponse<IEnumerable<Employee>>(employees);
        }
    }
}
