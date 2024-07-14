using Microsoft.AspNetCore.Mvc;
using DashAccountingSystemV2.BackEnd.BusinessLogic;
using DashAccountingSystemV2.BackEnd.Extensions;
using DashAccountingSystemV2.BackEnd.Security.Authorization;
using DashAccountingSystemV2.BackEnd.ViewModels;

namespace DashAccountingSystemV2.BackEnd.Controllers
{
    [ApiAuthorize]
    [ApiController]
    [Route("api/workforce")]
    public class EmployeeController : ControllerBase
    {
        private readonly IEmployeeBusinessLogic _employeeBusinessLogic;

        public EmployeeController(IEmployeeBusinessLogic employeeBusinessLogic)
        {
            _employeeBusinessLogic = employeeBusinessLogic;
        }

        [HttpGet("{tenantId:guid}/employees")]
        public Task<IActionResult> GetEmployees([FromRoute] Guid tenantId)
        {
            var bizLogicResponse = _employeeBusinessLogic.GetByTenant(tenantId);
            return this.Result(bizLogicResponse, EmployeeLiteResponseViewModel.FromModel);
        }
    }
}
