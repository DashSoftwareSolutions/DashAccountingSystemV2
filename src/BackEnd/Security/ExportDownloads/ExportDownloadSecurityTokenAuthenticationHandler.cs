using System.Security.Claims;
using System.Text.Encodings.Web;
using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Options;
using static DashAccountingSystemV2.BackEnd.Security.Constants;

namespace DashAccountingSystemV2.BackEnd.Security.ExportDownloads
{
    public class ExportDownloadSecurityTokenAuthenticationHandler
        : SignInAuthenticationHandler<ExportDownloadSecurityTokenAuthenticationHandlerOptions>
    {
        private readonly IExportDownloadSecurityTokenService _securityTokenService;
        private readonly ILogger _logger;

        public ExportDownloadSecurityTokenAuthenticationHandler(
            IExportDownloadSecurityTokenService securityTokenService,
            IOptionsMonitor<ExportDownloadSecurityTokenAuthenticationHandlerOptions> options,
            ILoggerFactory loggerFactory,
            UrlEncoder encoder)
            : base(
                  options,
                  loggerFactory,
                  encoder)
        {
            _securityTokenService = securityTokenService;
            _logger = loggerFactory.CreateLogger<ExportDownloadSecurityTokenAuthenticationHandler>();
        }

        protected override async Task<AuthenticateResult> HandleAuthenticateAsync()
        {
            string? token = Request.Query["token"];

            if (string.IsNullOrEmpty(token))
            {
                _logger.LogDebug("No token found in request query string");
                return HandleRequestResult.SkipHandler();
            }

            var exportDownloadAuthenticationTicket = await _securityTokenService.RedeemExportDownloadToken(token);

            if (exportDownloadAuthenticationTicket == null)
            {
                _logger.LogDebug("Security Token Service RedeemExportDownloadToken() returned null");
                return AuthenticateResult.Fail("Export Download Token Not Valid; Unauthorized");
            }

            var claims = new List<Claim>()
            {
                new(ClaimTypes.NameIdentifier, exportDownloadAuthenticationTicket.UserId.ToString()),
                new(DashClaimTypes.TenantId, exportDownloadAuthenticationTicket.TenantId.ToString()),
                new(DashClaimTypes.ExportType, exportDownloadAuthenticationTicket.ExportType.ToString()),
            };

            var principal = new ClaimsPrincipal(new ClaimsIdentity(claims, ExportDownloadAuthenticationScheme));
            var authenticationTicket = new AuthenticationTicket(principal, new AuthenticationProperties(), ExportDownloadAuthenticationScheme);
            return AuthenticateResult.Success(authenticationTicket);
        }

        protected override Task HandleSignInAsync(ClaimsPrincipal user, AuthenticationProperties? properties) => Task.CompletedTask;

        protected override Task HandleSignOutAsync(AuthenticationProperties? properties) => Task.CompletedTask;
    }
}
