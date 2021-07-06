using System;
using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using static DashAccountingSystemV2.Security.Constants;

namespace DashAccountingSystemV2.Security.ExportDownloads
{
    public static class ConfigurationExtensions
    {
        public static IServiceCollection AddExportDownloadSecurityTokenService(this IServiceCollection services)
        {
            services.AddSingleton<IExportDownloadSecurityTokenService, ExportDownloadSecurityTokenService>();
            return services;
        }

        public static AuthenticationBuilder AddExportDownloadToken(this AuthenticationBuilder builder)
        {
            return AddExportDownloadToken(builder, ExportDownloadAuthenticationScheme, options => { });
        }

        public static AuthenticationBuilder AddExportDownloadToken(
            this AuthenticationBuilder builder,
            Action<ExportDownloadSecurityTokenAuthenticationHandlerOptions> configureOptions)
        {
            return AddExportDownloadToken(builder, ExportDownloadAuthenticationScheme, configureOptions);
        }

        public static AuthenticationBuilder AddExportDownloadToken(
            this AuthenticationBuilder builder,
            string authenticationScheme,
            Action<ExportDownloadSecurityTokenAuthenticationHandlerOptions> configureOptions)
        {
            builder.Services.AddSingleton<IPostConfigureOptions<ExportDownloadSecurityTokenAuthenticationHandlerOptions>, ExportDownloadSecurityTokenAuthenticationHandlerOptions>();
            return builder.AddScheme<ExportDownloadSecurityTokenAuthenticationHandlerOptions, ExportDownloadSecurityTokenAuthenticationHandler>(authenticationScheme, configureOptions);
        }
    }
}
