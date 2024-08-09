using System.Security.Claims;
using System.Text.Encodings.Web;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using static DashAccountingSystemV2.BackEnd.Security.Constants;

namespace DashAccountingSystemV2.BackEnd.Security.Authentication
{
    /// <summary>
    /// Composite Authentication Handler that tries both Bearer Token authentication and Export Download Token authentication
    /// </summary>
    /// <remarks>
    /// 
    /// </remarks>
    /// <param name="options">Authentication Scheme Options</param>
    /// <param name="logger">Logger Factory</param>
    /// <param name="encoder">URL Encoder</param>
    public class ApplicationAuthenticationHandler(IOptionsMonitor<AuthenticationSchemeOptions> options, ILoggerFactory logger, UrlEncoder encoder)
        : SignInAuthenticationHandler<AuthenticationSchemeOptions>(options, logger, encoder)
    {
        protected override async Task<AuthenticateResult> HandleAuthenticateAsync()
        {
            var bearerResult = await Context.AuthenticateAsync(IdentityConstants.BearerScheme);

            // Only try to authenticate with the application cookie if there is no bearer token.
            if (!bearerResult.None)
            {
                return bearerResult;
            }

            // otherwise try export download token
            return await Context.AuthenticateAsync(ExportDownloadAuthenticationScheme);
        }

        protected override Task HandleSignInAsync(ClaimsPrincipal user, AuthenticationProperties? properties)
        {
            throw new NotImplementedException();
        }

        protected override Task HandleSignOutAsync(AuthenticationProperties? properties)
        {
            throw new NotImplementedException();
        }
    }
}
