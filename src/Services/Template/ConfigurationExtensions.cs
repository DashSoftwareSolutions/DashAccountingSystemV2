using Microsoft.Extensions.DependencyInjection;

namespace DashAccountingSystemV2.Services.Template
{
    public static class ConfigurationExtensions
    {
        public static IServiceCollection AddTemplateService(this IServiceCollection services)
        {
            // Template Provider
            services.AddSingleton<ITemplateProvider, FileSystemTemplateProvider>();

            return services;
        }
    }
}
