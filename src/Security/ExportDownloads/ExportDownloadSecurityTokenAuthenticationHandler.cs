using System.Collections.Generic;
using System.Security.Claims;
using System.Text.Encodings.Web;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using IdentityModel;
using static DashAccountingSystemV2.Security.Constants;

namespace DashAccountingSystemV2.Security.ExportDownloads
{
    public class ExportDownloadSecurityTokenAuthenticationHandler
        : AuthenticationHandler<ExportDownloadSecurityTokenAuthenticationHandlerOptions>
    {
        private readonly IExportDownloadSecurityTokenService _securityTokenService = null;
        private readonly ILogger _logger = null;

        public ExportDownloadSecurityTokenAuthenticationHandler(
            IExportDownloadSecurityTokenService securityTokenService,
            IOptionsMonitor<ExportDownloadSecurityTokenAuthenticationHandlerOptions> options,
            ILoggerFactory loggerFactory,
            UrlEncoder encoder,
            ISystemClock clock)
            : base(
                  options,
                  loggerFactory,
                  encoder,
                  clock)
        {
            _securityTokenService = securityTokenService;
            _logger = loggerFactory.CreateLogger<ExportDownloadSecurityTokenAuthenticationHandler>();
        }

        protected override async Task<AuthenticateResult> HandleAuthenticateAsync()
        {
            string token = Request.Query["token"];

            if (string.IsNullOrEmpty(token))
            {
                _logger.LogDebug("No token found in request query string");
                return HandleRequestResult.SkipHandler();
            }

            var exportDownloadAuthnTicket = await _securityTokenService.RedeemExportDownloadToken(token);

            if (exportDownloadAuthnTicket == null)
            {
                _logger.LogDebug("Security Token Service RedeemExportDownloadToken() returned null");
                return AuthenticateResult.Fail("Export Download Token Not Valid; Unauthorized");
            }

            var claims = new List<Claim>() {
                new Claim(ClaimTypes.NameIdentifier, exportDownloadAuthnTicket.UserId.ToString()),
                new Claim(JwtClaimTypes.Subject, exportDownloadAuthnTicket.UserId.ToString()),
                new Claim(DashClaimTypes.TenantId, exportDownloadAuthnTicket.TenantId.ToString()),
                new Claim(DashClaimTypes.ExportType, exportDownloadAuthnTicket.ExportType.ToString()),
            };

            var principal = new ClaimsPrincipal(new ClaimsIdentity(claims, ExportDownloadAuthenticationScheme));
            var authnTicket = new AuthenticationTicket(principal, new AuthenticationProperties(), ExportDownloadAuthenticationScheme);
            return AuthenticateResult.Success(authnTicket);
        }
    }
}
