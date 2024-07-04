using Microsoft.AspNetCore.Mvc;
using DashAccountingSystemV2.BusinessLogic;
using DashAccountingSystemV2.Extensions;
using DashAccountingSystemV2.Security.Authorization;
using DashAccountingSystemV2.ViewModels;

namespace DashAccountingSystemV2.Controllers
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
