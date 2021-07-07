using Microsoft.Extensions.DependencyInjection;

namespace DashAccountingSystemV2.Services.Export
{
    public static class ConfigurationExtensions
    {
        public static IServiceCollection AddExportService(this IServiceCollection services)
        {
            return services.AddSingleton<IExportService, ExportService>();
        }
    }
}
