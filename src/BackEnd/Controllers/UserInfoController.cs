using System.Security.Claims;
using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.AspNetCore.Mvc;
using DashAccountingSystemV2.BackEnd.Security.Authentication;
using DashAccountingSystemV2.BackEnd.Security.Authorization;
using DashAccountingSystemV2.BackEnd.ViewModels;

namespace DashAccountingSystemV2.BackEnd.Controllers
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
                    title: "Internal Server Error");
            }

            return Ok(ApplicationUserLiteViewModel.FromModel(user!));
        }
    }
}
