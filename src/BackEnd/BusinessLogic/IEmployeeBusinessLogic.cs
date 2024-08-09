using DashAccountingSystemV2.BackEnd.Models;

namespace DashAccountingSystemV2.BackEnd.BusinessLogic
{
    public interface IEmployeeBusinessLogic : IBusinessLogic
    {
        Task<BusinessLogicResponse<IEnumerable<Employee>>> GetByTenant(
            Guid tenantId,
            IEnumerable<uint>? employeeNumbers = null,
            bool onlyActive = true);

        // TODO: Add GetDetailedById() and CUD methods as needed
    }
}
