using System.Reflection;
using System.Security.Claims;
using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.AspNetCore.Mvc;
using DashAccountingSystemV2.BusinessLogic;
using DashAccountingSystemV2.Extensions;
using DashAccountingSystemV2.Security.Authentication;
using DashAccountingSystemV2.Security.Authorization;
using DashAccountingSystemV2.ViewModels;

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
                    "You must be logged in to make this request.",
                    HttpContext.Request.GetEncodedPathAndQuery(),
                    StatusCodes.Status401Unauthorized,
                    "Unauthorized",
                    "https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/401");
            }

            var user = await _userManager.FindByIdAsync(userId);

            if (user == null)
            {
                return Problem(
                    "An unexpected error occurred while attempting to serve this request.",
                    HttpContext.Request.GetEncodedPathAndQuery(),
                    StatusCodes.Status500InternalServerError,
                    "Internal Server Error",
                    "https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/500");
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
