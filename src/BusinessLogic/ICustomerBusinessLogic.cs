using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using DashAccountingSystemV2.Models;

namespace DashAccountingSystemV2.BusinessLogic
{
    public interface ICustomerBusinessLogic : IBusinessLogic
    {
        Task<BusinessLogicResponse<IEnumerable<Customer>>> GetByTenant(
            Guid tenantId,
            IEnumerable<string> customerNumbers = null,
            bool onlyActive = true);

        // TODO: Add GetDetaildById() and CUD methods as needed
    }
}
