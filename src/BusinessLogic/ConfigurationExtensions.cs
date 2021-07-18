using Microsoft.Extensions.DependencyInjection;

namespace DashAccountingSystemV2.BusinessLogic
{
    public static class ConfigurationExtensions
    {
        public static IServiceCollection AddBusinessLogic(this IServiceCollection services)
        {
            services
                .AddScoped<ITenantBusinessLogic, TenantBusinessLogic>()
                .AddScoped<IAccountBusinessLogic, AccountBusinessLogic>()
                .AddScoped<IAccountingReportBusinessLogic, AccountingReportBusinessLogic>()
                .AddScoped<ICustomerBusinessLogic, CustomerBusinessLogic>()
                .AddScoped<IEmployeeBusinessLogic, EmployeeBusinessLogic>()
                .AddScoped<IJournalEntryBusinessLogic, JournalEntryBusinessLogic>()
                .AddScoped<ILedgerBusinessLogic, LedgerBusinessLogic>()
                .AddScoped<IProductBusinessLogic, ProductBusinessLogic>()
                .AddScoped<ITimeActivityBusinessLogic, TimeActivityBusinessLogic>();

            return services;
        }
    }
}
