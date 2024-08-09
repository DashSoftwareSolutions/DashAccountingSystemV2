using Microsoft.AspNetCore.Mvc;
using DashAccountingSystemV2.BackEnd.BusinessLogic;
using DashAccountingSystemV2.BackEnd.Extensions;
using DashAccountingSystemV2.BackEnd.Security.Authorization;
using DashAccountingSystemV2.BackEnd.ViewModels;

namespace DashAccountingSystemV2.BackEnd.Controllers
{
    [ApiAuthorize]
    [ApiController]
    [Route("api/sales")]
    public class CustomerController : ControllerBase
    {
        private readonly ICustomerBusinessLogic _customerBusinessLogic;

        public CustomerController(ICustomerBusinessLogic customerBusinessLogic)
        {
            _customerBusinessLogic = customerBusinessLogic;
        }

        [HttpGet("{tenantId:guid}/customers")]
        public Task<IActionResult> GetCustomers([FromRoute] Guid tenantId)
        {
            var bizLogicResponse = _customerBusinessLogic.GetByTenant(tenantId);
            return this.Result(bizLogicResponse, CustomerLiteResponseViewModel.FromModel);
        }

        [HttpGet("{tenantId:guid}/customer/{customerNumber}")]
        public Task<IActionResult> GetCustomer([FromRoute] Guid tenantId, [FromRoute] string customerNumber)
        {
            var bizLogicResponse = _customerBusinessLogic.GetDetailedByTenantIdAndCustomerNumber(tenantId, customerNumber);
            return this.Result(bizLogicResponse, CustomerDetailedResponseViewModel.FromModel);
        }
    }
}
