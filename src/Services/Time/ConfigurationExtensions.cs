using Microsoft.Extensions.DependencyInjection;

namespace DashAccountingSystemV2.Services.Time
{
    public static class ConfigurationExtensions
    {
        public static IServiceCollection AddTimeProvider(this IServiceCollection services)
        {
            return services.AddSingleton<ITimeProvider, TimeProvider>();
        }
    }
}
