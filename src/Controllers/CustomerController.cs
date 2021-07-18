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
            var bizLogcResponse = _customerBusinessLogic.GetByTenant(tenantId);
            return this.Result(bizLogcResponse, CustomerLiteResponseViewModel.FromModel);
        }
    }
}
