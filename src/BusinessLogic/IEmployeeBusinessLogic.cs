using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using DashAccountingSystemV2.Models;

namespace DashAccountingSystemV2.BusinessLogic
{
    public interface IEmployeeBusinessLogic
    {
        Task<BusinessLogicResponse<IEnumerable<Employee>>> GetByTenant(
            Guid tenantId,
            IEnumerable<uint> employeeNumbers = null,
            bool onlyActive = true);

        // TODO: Add GetDetaildById() and CUD methods as needed
    }
}
