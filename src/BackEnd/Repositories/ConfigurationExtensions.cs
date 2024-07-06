namespace DashAccountingSystemV2.BackEnd.Repositories
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
                .AddScoped<ITimeActivityRepository, TimeActivityRepository>()
                .AddScoped<IInvoiceTermsRepository, InvoiceTermsRepository>()
                .AddScoped<IInvoiceRepository, InvoiceRepository>()
                .AddScoped<IPaymentRepository, PaymentRepository>();

            return services;
        }
    }
}
