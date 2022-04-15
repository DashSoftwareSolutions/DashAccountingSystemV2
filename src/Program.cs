using System.Security.Cryptography.X509Certificates;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Serilog;
using DashAccountingSystemV2.Extensions;

namespace DashAccountingSystemV2
{
    public class Program
    {
        private static IConfiguration _configuration;

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
                {
                    _configuration = hosting.Configuration;

                    loggerConfig.ReadFrom.Configuration(hosting.Configuration);
                })
                .ConfigureLogging(logging =>
                {
                    logging.ClearProviders();
                    logging.AddConsole();
                })
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder
                        .ConfigureKestrel(serverOptions =>
                        {
                            // If a custom server HTTPS certificate appears to be configured, use it
                            var customServerHttpsCertificatePath = _configuration["CertFilename"];
                            var customServerHttpsCertificatePassword = _configuration["CertPassword"];

                            if (!string.IsNullOrEmpty(customServerHttpsCertificatePath) &&
                                !string.IsNullOrEmpty(customServerHttpsCertificatePassword))
                            {
                                serverOptions.ConfigureHttpsDefaults(listenOptions =>
                                {
                                    listenOptions.ServerCertificate = new X509Certificate2(
                                        customServerHttpsCertificatePath,
                                        customServerHttpsCertificatePassword);
                                });
                            }

                            // Otherwise it should use the default ASP.NET Core HTTPS development certificate
                        })
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
