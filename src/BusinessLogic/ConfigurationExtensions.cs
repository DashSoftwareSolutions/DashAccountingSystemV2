using Microsoft.Extensions.DependencyInjection;

namespace DashAccountingSystemV2.BusinessLogic
{
    public static class ConfigurationExtensions
    {
        public static IServiceCollection AddBusinessLogic(this IServiceCollection services)
        {
            services
                .AddScoped<ITenantBusinessLogic, TenantBusinessLogic>();

            return services;
        }
    }
}
