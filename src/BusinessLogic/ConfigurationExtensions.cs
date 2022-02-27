using Microsoft.Extensions.DependencyInjection;

namespace DashAccountingSystemV2.BusinessLogic
{
    public static class ConfigurationExtensions
    {
        public static IServiceCollection AddBusinessLogic(this IServiceCollection services)
        {
            // Business Logic layer objects
            services
                .AddScoped<ITenantBusinessLogic, TenantBusinessLogic>()
                .AddScoped<IAccountBusinessLogic, AccountBusinessLogic>()
                .AddScoped<IAccountingReportBusinessLogic, AccountingReportBusinessLogic>()
                .AddScoped<ICustomerBusinessLogic, CustomerBusinessLogic>()
                .AddScoped<IEmployeeBusinessLogic, EmployeeBusinessLogic>()
                .AddScoped<IJournalEntryBusinessLogic, JournalEntryBusinessLogic>()
                .AddScoped<ILedgerBusinessLogic, LedgerBusinessLogic>()
                .AddScoped<IProductBusinessLogic, ProductBusinessLogic>()
                .AddScoped<ITimeActivityBusinessLogic, TimeActivityBusinessLogic>()
                .AddScoped<ITimeZoneBusinessLogic, TimeZoneBusinessLogic>()
                .AddScoped<IInvoiceBusinessLogic, InvoiceBusinessLogic>()
                .AddScoped<IPaymentBusinessLogic, PaymentBusinessLogic>();

            // Business Logic Facades
            services
                .AddScoped<IPaymentFacade, PaymentFacade>();

            return services;
        }
    }
}
