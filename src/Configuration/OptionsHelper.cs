using System;
using System.Linq;
using Microsoft.Extensions.Options;
using DashAccountingSystemV2.Extensions;

namespace DashAccountingSystemV2.Configuration
{
    public static class OptionsHelper
    {
        public static IOptions<TOptions> Make<TOptions>() where TOptions : class, new()
        {
            return new OptionsManager<TOptions>(
                new OptionsFactory<TOptions>(
                    IEnumerableExtensions.CreateEnumerable(new ConfigureOptions<TOptions>(opt => { })),
                    Enumerable.Empty<IPostConfigureOptions<TOptions>>()));
        }

        public static IOptions<TOptions> Make<TOptions>(Action<TOptions> action) where TOptions : class, new()
        {
            return new OptionsManager<TOptions>(
                new OptionsFactory<TOptions>(
                    IEnumerableExtensions.CreateEnumerable(new ConfigureOptions<TOptions>(action)),
                    Enumerable.Empty<IPostConfigureOptions<TOptions>>()));
        }

        public static IOptions<TOptions> Make<TOptions>(TOptions options) where TOptions : class, new()
        {
            return new OptionsWrapper<TOptions>(options);
        }
    }
}
