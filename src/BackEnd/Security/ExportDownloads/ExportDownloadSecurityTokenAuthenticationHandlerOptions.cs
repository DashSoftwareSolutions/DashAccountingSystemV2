using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Options;

namespace DashAccountingSystemV2.BackEnd.Security.ExportDownloads
{
    public class ExportDownloadSecurityTokenAuthenticationHandlerOptions
        : AuthenticationSchemeOptions, IPostConfigureOptions<ExportDownloadSecurityTokenAuthenticationHandlerOptions>
    {
        public ExportDownloadSecurityTokenAuthenticationHandlerOptions() : base()
        {
        }

        public void PostConfigure(string? name, ExportDownloadSecurityTokenAuthenticationHandlerOptions options)
        {
        }
    }
}
