using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Serilog;
using DashAccountingSystemV2.Extensions;

namespace DashAccountingSystemV2
{
    public class Program
    {
        public static void Main(string[] args)
        {
            Log.Logger = new LoggerConfiguration()
                .Enrich.FromLogContext()
                .CreateLogger();

            CreateHostBuilder(args).Build().Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .UseSerilog((hosting, loggerConfig) =>
                    loggerConfig.ReadFrom.Configuration(hosting.Configuration))
                .ConfigureLogging(logging =>
                {
                    logging.ClearProviders();
                    logging.AddConsole();
                })
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder
                        .UseStartup<Startup>();
                });

        private static void ConfigureLogging(WebHostBuilderContext webHostBuilderContext, ILoggingBuilder loggingBuilder)
        {
            // Build the intermediate service provider
            var serviceProvider = loggingBuilder.Services.BuildServiceProvider();
            var loggerFactory = serviceProvider.GetService<ILoggerFactory>();

            var setupLogger = loggerFactory.CreateLogger<Program>();

            Log.Logger = webHostBuilderContext.Configuration.ConfigureLogger(
                "dash-accounting",
                webHostBuilderContext.HostingEnvironment.EnvironmentName,
                out string message).CreateLogger();

            setupLogger.LogInformation(message);
        }
    }
}
