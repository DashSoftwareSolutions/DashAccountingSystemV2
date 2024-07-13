namespace DashAccountingSystemV2.BackEnd.BusinessLogic
{
    public static class ConfigurationExtensions
    {
        public static IServiceCollection AddBusinessLogic(this IServiceCollection services)
        {
            services
                .AddScoped<ITenantBusinessLogic, TenantBusinessLogic>()
                .AddScoped<IAccountBusinessLogic, AccountBusinessLogic>()
                .AddScoped<IAccountingReportBusinessLogic, AccountingReportBusinessLogic>()
                .AddScoped<ILedgerBusinessLogic, LedgerBusinessLogic>()
                .AddScoped<IJournalEntryBusinessLogic, JournalEntryBusinessLogic>()
                .AddScoped<ITimeZoneBusinessLogic, TimeZoneBusinessLogic>();

            return services;
        }
    }
}
