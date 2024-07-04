using System.Security.Claims;
using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.AspNetCore.Mvc;
using DashAccountingSystemV2.Security.Authentication;
using DashAccountingSystemV2.Security.Authorization;
using DashAccountingSystemV2.ViewModels;

namespace DashAccountingSystemV2.Controllers
{
    [ApiAuthorize]
    [ApiController]
    [Route("api/user-info")]
    public class UserInfoController : ControllerBase
    {
        private readonly ApplicationUserManager _userManager;

        public UserInfoController(ApplicationUserManager userManager)
        {
            _userManager = userManager;
        }

        [HttpGet]
        [ProducesResponseType(typeof(ApplicationUserLiteViewModel), StatusCodes.Status200OK)]
        [ProducesErrorResponseType(typeof(ProblemDetails))]
        public async Task<IActionResult> Get()
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

            return Ok(ApplicationUserLiteViewModel.FromModel(user!));
        }
    }
}
