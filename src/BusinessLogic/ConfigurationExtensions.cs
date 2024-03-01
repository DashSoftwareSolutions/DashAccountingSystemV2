﻿namespace DashAccountingSystemV2.BusinessLogic
{
    public static class ConfigurationExtensions
    {
        public static IServiceCollection AddBusinessLogic(this IServiceCollection services)
        {
            // Business Logic layer objects
            services
                .AddScoped<ITenantBusinessLogic, TenantBusinessLogic>()
                .AddScoped<IAccountBusinessLogic, AccountBusinessLogic>()
                .AddScoped<ILedgerBusinessLogic, LedgerBusinessLogic>();

            return services;
        }
    }
}
