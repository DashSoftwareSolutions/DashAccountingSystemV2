using Microsoft.AspNetCore.Mvc;
using DashAccountingSystemV2.BackEnd.BusinessLogic;
using DashAccountingSystemV2.BackEnd.Extensions;
using DashAccountingSystemV2.BackEnd.Security.Authorization;
using DashAccountingSystemV2.BackEnd.ViewModels;

namespace DashAccountingSystemV2.BackEnd.Controllers
{
    [ApiAuthorize]
    [ApiController]
    [Route("api/tenants")]
    public class TenantController : ControllerBase
    {
        private readonly ITenantBusinessLogic _tenantBusinessLogic;

        public TenantController(ITenantBusinessLogic tenantBusinessLogic)
        {
            _tenantBusinessLogic = tenantBusinessLogic;
        }

        [HttpGet]
        public Task<IActionResult> GetTenants()
        {
            var tenantsBizLogicResponse = _tenantBusinessLogic.GetTenants();
            return this.Result(tenantsBizLogicResponse, TenantViewModel.FromModel);
        }
    }
}
