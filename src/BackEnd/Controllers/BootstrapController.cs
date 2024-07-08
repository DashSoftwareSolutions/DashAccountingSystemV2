using System.Reflection;
using System.Security.Claims;
using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.AspNetCore.Mvc;
using DashAccountingSystemV2.BackEnd.BusinessLogic;
using DashAccountingSystemV2.BackEnd.Extensions;
using DashAccountingSystemV2.BackEnd.Security.Authentication;
using DashAccountingSystemV2.BackEnd.Security.Authorization;
using DashAccountingSystemV2.BackEnd.ViewModels;

namespace DashAccountingSystemV2.BackEnd.Controllers
{
    [ApiAuthorize]
    [ApiController]
    [Route("api/bootstrap")]
    public class BootstrapController : ControllerBase
    {
        private readonly ITenantBusinessLogic _tenantBusinessLogic;
        private readonly ApplicationUserManager _userManager;

        public BootstrapController(ITenantBusinessLogic tenantBusinessLogic, ApplicationUserManager userManager)
        {
            _tenantBusinessLogic = tenantBusinessLogic;
            _userManager = userManager;
        }

        [HttpGet]
        public async Task<IActionResult> GetBootstrapInfo()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (userId == null)
            {
                return Problem(
                    detail: "You must be logged in to make this request.",
                    instance: HttpContext.Request.GetEncodedPathAndQuery(),
                    statusCode: StatusCodes.Status401Unauthorized,
                    title: "Unauthorized");
            }

            var user = await _userManager.FindByIdAsync(userId);

            if (user == null)
            {
                return Problem(
                    detail: "An unexpected error occurred while attempting to serve this request.",
                    instance: HttpContext.Request.GetEncodedPathAndQuery(),
                    statusCode: StatusCodes.Status500InternalServerError,
                    "Internal Server Error");
            }

            var tenantsBizLogicResponse = await _tenantBusinessLogic.GetTenants();

            if (!tenantsBizLogicResponse.IsSuccessful)
                return this.ErrorResponse(tenantsBizLogicResponse);

            var response = new BootstrapResponseViewModel()
            {
                ApplicationVersion = Assembly.GetEntryAssembly()?.GetCustomAttribute<AssemblyInformationalVersionAttribute>()?.InformationalVersion,
                Tenants = tenantsBizLogicResponse.Data.Select(TenantViewModel.FromModel),
                UserInfo = ApplicationUserLiteViewModel.FromModel(user),
            };

            return Ok(response);
        }
    }
}
