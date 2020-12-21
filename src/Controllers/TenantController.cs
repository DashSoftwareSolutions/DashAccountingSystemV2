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
    [Route("api/tenant")]
    public class TenantController : Controller
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
