namespace DashAccountingSystemV2.BackEnd.Services.Template
{
    public static class ConfigurationExtensions
    {
        public static IServiceCollection AddTemplateService(this IServiceCollection services)
        {
            // Template Provider
            services.AddSingleton<ITemplateProvider, FileSystemTemplateProvider>();

            // Template Service
            services.AddSingleton<ITemplateService, TemplateService>();

            return services;
        }
    }
}
