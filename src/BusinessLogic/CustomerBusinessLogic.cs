using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using DashAccountingSystemV2.Models;
using DashAccountingSystemV2.Repositories;

namespace DashAccountingSystemV2.BusinessLogic
{
    public class CustomerBusinessLogic : ICustomerBusinessLogic
    {
        private readonly ICustomerRepository _customerRepository = null;
        private readonly ITenantRepository _tenantRepository = null;

        public CustomerBusinessLogic(
            ICustomerRepository customerRepository,
            ITenantRepository tenantRepository)
        {
            _customerRepository = customerRepository;
            _tenantRepository = tenantRepository;
        }

        public async Task<BusinessLogicResponse<IEnumerable<Customer>>> GetByTenant(
            Guid tenantId,
            IEnumerable<string> customerNumbers = null,
            bool onlyActive = true)
        {
            var tenant = await _tenantRepository.GetTenantAsync(tenantId);

            if (tenant == null)
            {
                return new BusinessLogicResponse<IEnumerable<Customer>>(ErrorType.RequestedEntityNotFound, "Tenant not found");
            }

            // TODO: Verify access to tenant and permission for listing customers

            var results = await _customerRepository.GetByTenantIdAsync(
                tenantId,
                customerNumbers,
                onlyActive);

            return new BusinessLogicResponse<IEnumerable<Customer>>(results);
        }
    }
}
