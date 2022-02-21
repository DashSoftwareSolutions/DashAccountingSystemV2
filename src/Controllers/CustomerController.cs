using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using DashAccountingSystemV2.BusinessLogic;
using DashAccountingSystemV2.Extensions;
using DashAccountingSystemV2.ViewModels;

namespace DashAccountingSystemV2.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/sales")]
    public class CustomerController : Controller
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
