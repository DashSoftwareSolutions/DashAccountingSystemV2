// Adapted from: https://github.com/dotnet/aspnetcore/blob/v8.0.6/src/Identity/Core/src/IdentityApiEndpointRouteBuilderExtensions.cs

using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using DashAccountingSystemV2.BackEnd.Models;
using Microsoft.AspNetCore.Authentication.BearerToken;
using Microsoft.Extensions.Options;
using DashAccountingSystemV2.BackEnd.Security.Authorization;

namespace DashAccountingSystemV2.BackEnd.Controllers
{
    [ApiController]
    [Route("api/authentication")]
    public class AuthenticationController : ControllerBase
    {
        private readonly BearerTokenOptions _bearerTokenOptions;
        private readonly ILogger<AuthenticationController> _logger;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly TimeProvider _timeProvider;

        public AuthenticationController(
            IOptions<BearerTokenOptions> bearerTokenOptions,
            ILogger<AuthenticationController> logger,
            SignInManager<ApplicationUser> signInManager,
            TimeProvider timeProvider)
        {
            _bearerTokenOptions = bearerTokenOptions.Value;
            _logger = logger;
            _signInManager = signInManager;
            _signInManager.AuthenticationScheme = IdentityConstants.BearerScheme;
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
        /// <returns></returns>
        [HttpPost("refresh-token")]
        [ProducesResponseType(typeof(AccessTokenResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> RefreshAccessToken([FromBody] RefreshRequest refreshRequest)
        {
            var refreshTokenProtector = _bearerTokenOptions.RefreshTokenProtector;
            var refreshTicket = refreshTokenProtector.Unprotect(refreshRequest.RefreshToken);

            // Reject the /refresh attempt with a 401 if the token expired or the security stamp validation fails
            if (refreshTicket?.Properties?.ExpiresUtc is not { } expiresUtc ||
                _timeProvider.GetUtcNow() >= expiresUtc ||
                await _signInManager.ValidateSecurityStampAsync(refreshTicket.Principal) is not ApplicationUser user)

            {
                return Challenge();
            }

            var newPrincipal = await _signInManager.CreateUserPrincipalAsync(user);
            return SignIn(newPrincipal, authenticationScheme: IdentityConstants.BearerScheme);
        }

        [ApiAuthorize]
        [HttpPost("logout")]
        public async Task<IActionResult> Logout([FromBody] object _)
        {
            await _signInManager.SignOutAsync();
            return Ok();
        }
    }
}
