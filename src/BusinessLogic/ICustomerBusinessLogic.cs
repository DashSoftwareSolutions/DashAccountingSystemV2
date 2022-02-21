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

        Task<BusinessLogicResponse<Customer>> GetDetailedById(Guid customerId);

        Task<BusinessLogicResponse<Customer>> GetDetailedByTenantIdAndCustomerNumber(
            Guid tenantId,
            string customerNumber);

        // TODO: Add CUD methods as needed
    }
}
