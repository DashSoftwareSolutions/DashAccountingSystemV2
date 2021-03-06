﻿using Microsoft.Extensions.DependencyInjection;

namespace DashAccountingSystemV2.Services.Caching
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
