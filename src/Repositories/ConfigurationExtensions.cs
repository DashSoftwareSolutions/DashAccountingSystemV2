using Microsoft.Extensions.DependencyInjection;

namespace DashAccountingSystemV2.Repositories
{
    public static class ConfigurationExtensions
    {
        public static IServiceCollection AddRepositories(this IServiceCollection services)
        {
            services
                .AddScoped<IAccountRepository, AccountRepository>()
                .AddScoped<IJournalEntryRepository, JournalEntryRepository>()
                .AddScoped<ISharedLookupRepository, SharedLookupRepository>()
                .AddScoped<ITenantRepository, TenantRepository>();

            return services;
        }
    }
}
