namespace DashAccountingSystemV2.BackEnd.Services.Caching
{
    public static class ConfigurationExtensions
    {
        public static IServiceCollection AddCaching(this IServiceCollection services)
        {
            services
                .AddSingleton<IExtendedDistributedCache, GeneralPurposeLocalMemoryCache>();

            return services;
        }
    }
}
