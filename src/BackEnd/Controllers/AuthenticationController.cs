// Adapted from: https://github.com/dotnet/aspnetcore/blob/v8.0.6/src/Identity/Core/src/IdentityApiEndpointRouteBuilderExtensions.cs

using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Authentication.BearerToken;
using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using DashAccountingSystemV2.BackEnd.Models;
using DashAccountingSystemV2.BackEnd.Extensions;
using DashAccountingSystemV2.BackEnd.Security.Authorization;
using DashAccountingSystemV2.BackEnd.ViewModels;

namespace DashAccountingSystemV2.BackEnd.Controllers
{
    [ApiController]
    [Route("api/authentication")]
    public class AuthenticationController : ControllerBase
    {
        private readonly IOptionsMonitor<BearerTokenOptions> _bearerTokenOptions;
        private readonly ILogger<AuthenticationController> _logger;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly TimeProvider _timeProvider;

        public AuthenticationController(
            IOptionsMonitor<BearerTokenOptions> bearerTokenOptions,
            ILogger<AuthenticationController> logger,
            SignInManager<ApplicationUser> signInManager,
            UserManager<ApplicationUser> userManager,
            TimeProvider timeProvider)
        {
            _bearerTokenOptions = bearerTokenOptions;
            _logger = logger;
            _signInManager = signInManager;
            _signInManager.AuthenticationScheme = IdentityConstants.BearerScheme;
            _userManager = userManager;
            _timeProvider = timeProvider;
        }

        /// <summary>
        /// Login to the application
        /// </summary>
        /// <param name="login">Login credentials</param>
        [HttpPost("login")]
        [ProducesResponseType(typeof(AccessTokenResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> Login([FromBody] LoginRequest login)
        {
            var result = await _signInManager.PasswordSignInAsync(login.Email, login.Password, isPersistent: false, lockoutOnFailure: true);

            if (result.RequiresTwoFactor)
            {
                if (!string.IsNullOrEmpty(login.TwoFactorCode))
                {
                    result = await _signInManager.TwoFactorAuthenticatorSignInAsync(login.TwoFactorCode, isPersistent: false, rememberClient: false);
                }
                else if (!string.IsNullOrEmpty(login.TwoFactorRecoveryCode))
                {
                    result = await _signInManager.TwoFactorRecoveryCodeSignInAsync(login.TwoFactorRecoveryCode);
                }
            }

            if (!result.Succeeded)
            {
                return Problem(
                    detail: $"The login attempt was not successful.  Status: {result}",
                    statusCode: StatusCodes.Status401Unauthorized);
            }

            // The signInManager already produced the needed response in the form of a cookie or bearer token.
            return Empty;
        }

        /// <summary>
        /// Refresh Access Token
        /// </summary>
        /// <param name="refreshRequest">Token Refresh request parameters</param>
        [HttpPost("refresh-token")]
        [ProducesResponseType(typeof(AccessTokenResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> RefreshAccessToken([FromBody] RefreshRequest refreshRequest)
        {
            var refreshTokenProtector = _bearerTokenOptions.Get(IdentityConstants.BearerScheme).RefreshTokenProtector;
            var refreshTicket = refreshTokenProtector.Unprotect(refreshRequest.RefreshToken);

            // Reject the /refresh attempt with a 401 if the token expired or the security stamp validation fails
            if (refreshTicket?.Properties?.ExpiresUtc is not { } expiresUtc ||
                _timeProvider.GetUtcNow() >= expiresUtc ||
                await _signInManager.ValidateSecurityStampAsync(refreshTicket.Principal) is not ApplicationUser user)

            {
                return Problem(
                    detail: $"The token refresh attempt was not successful.",
                    statusCode: StatusCodes.Status401Unauthorized);
            }

            var newPrincipal = await _signInManager.CreateUserPrincipalAsync(user);
            return SignIn(newPrincipal, authenticationScheme: IdentityConstants.BearerScheme);
        }

        /// <summary>
        /// Logout
        /// </summary>
        [ApiAuthorize]
        [HttpPost("logout")]
        public async Task<IActionResult> Logout([FromBody] object _)
        {
            await _signInManager.SignOutAsync();
            return Ok();
        }

        /// <summary>
        /// Allows an authenticated user to change his/her password
        /// </summary>
        /// <param name="changePasswordRequest">Change password request parameters</param>
        [ApiAuthorize]
        [HttpPost("change-password")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequestViewModel changePasswordRequest)
        {
            var user = await _userManager.GetUserAsync(User);
            
            if (user == null)
            {
                _logger.LogError("Unable to find user with ID {userId}", _userManager.GetUserId(User));

                return Problem(
                    detail: "An unexpected error occurred while attempting to serve this request.",
                    instance: HttpContext.Request.GetEncodedPathAndQuery(),
                    statusCode: StatusCodes.Status500InternalServerError,
                    title: "Internal Server Error");
            }

            var changePasswordResult = await _userManager.ChangePasswordAsync(user, changePasswordRequest.OldPassword, changePasswordRequest.NewPassword);

            if (!changePasswordResult.Succeeded)
            {
                foreach (var error in changePasswordResult.Errors)
                {
                    if (error.Description == "Incorrect password.")
                        ModelState.AddModelError(string.Empty, "Existing password is incorrect.");
                    else
                        ModelState.AddModelError(string.Empty, error.Description);
                }

                return this.ErrorResponse(ModelState);
            }

            await _signInManager.RefreshSignInAsync(user);
            _logger.LogInformation("User {userId} changed their password successfully.", _userManager.GetUserId(User));

            return Ok();
        }
    }
}
