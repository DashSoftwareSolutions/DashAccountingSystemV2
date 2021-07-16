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
    [Route("api/workforce")]
    public class EmployeeController : Controller
    {
        private readonly IEmployeeBusinessLogic _employeeBusinessLogic = null;

        public EmployeeController(IEmployeeBusinessLogic employeeBusinessLogic)
        {
            _employeeBusinessLogic = employeeBusinessLogic;
        }

        [HttpGet("{tenantId:guid}/employees")]
        public Task<IActionResult> GetEmployees([FromRoute] Guid tenantId)
        {
            var bizLogcResponse = _employeeBusinessLogic.GetByTenant(tenantId);
            return this.Result(bizLogcResponse, EmployeeLiteResponseViewModel.FromModel);
        }
    }
}
