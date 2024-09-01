using Microsoft.Extensions.Options;
using DashAccountingSystemV2.BackEnd.Extensions;

namespace DashAccountingSystemV2.BackEnd.Configuration
{
    public static class OptionsHelper
    {
        public static IOptions<TOptions> Make<TOptions>() where TOptions : class, new()
        {
            return new OptionsManager<TOptions>(
                new OptionsFactory<TOptions>(
                    IEnumerableExtensions.CreateEnumerable(new ConfigureOptions<TOptions>(opt => { })),
                    []));
        }

        public static IOptions<TOptions> Make<TOptions>(Action<TOptions> action) where TOptions : class, new()
        {
            return new OptionsManager<TOptions>(
                new OptionsFactory<TOptions>(
                    IEnumerableExtensions.CreateEnumerable(new ConfigureOptions<TOptions>(action)),
                    []));
        }

        public static IOptions<TOptions> Make<TOptions>(TOptions options) where TOptions : class, new()
        {
            return new OptionsWrapper<TOptions>(options);
        }
    }
}
