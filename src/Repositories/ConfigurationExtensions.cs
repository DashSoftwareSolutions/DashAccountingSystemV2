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
                .AddScoped<ITenantRepository, TenantRepository>()
                .AddScoped<ITimeZoneRepository, TimeZoneRepository>()
                .AddScoped<ICustomerRepository, CustomerRepository>()
                .AddScoped<IEmployeeRepository, EmployeeRepository>()
                .AddScoped<IProductRepository, ProductRepository>()
                .AddScoped<ITimeActivityRepository, TimeActivityRepository>();

            return services;
        }
    }
}
