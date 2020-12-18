using System;
using System.IO;
using System.Text;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Serilog;
using Serilog.Core;
using Serilog.Events;
using Serilog.Sinks.SystemConsole.Themes;
using DashAccountingSystemV2.Configuration;

namespace DashAccountingSystemV2.Extensions
{
    public static class ConfigurationExtensions
    {
        public static LoggerConfiguration ConfigureLogger(this IConfiguration configuration, string appName, string env, out string message)
        {
            var loggingConfiguration = configuration.GetSection("Logging").Get<LoggingConfigurationOptions>();

            // Uncomment this to see Serilog self logs.  This is good when something is going on in the configuration you need to debug
            // Serilog.Debugging.SelfLog.Enable(Console.Out);

            var configuredAppLogLevel = LogLevel.Information;
            var configuredLogLevelValid = Enum.TryParse(loggingConfiguration.LogLevel.Default, out configuredAppLogLevel);

            var applicationConfiguredLogLevel = LogLevel.Warning;
            Enum.TryParse(loggingConfiguration.LogLevel.Default, out applicationConfiguredLogLevel);
            var microsoftConfiguredLogLevel = LogLevel.Warning;
            Enum.TryParse(loggingConfiguration.LogLevel.Microsoft, out microsoftConfiguredLogLevel);
            var systemConfiguredLogLevel = LogLevel.Warning;
            Enum.TryParse(loggingConfiguration.LogLevel.System, out systemConfiguredLogLevel);
            var levelSwitch = new LoggingLevelSwitch
            {
                MinimumLevel = GetLogEventLevel(configuredAppLogLevel)
            };

            string configuredLogDir = null;
            var outputTemplate = "[{Timestamp:HH:mm:ss}] [{Level}] [{SourceContext}]{NewLine}   {Message}{NewLine}{Exception}{NewLine}";
            var logInfoStringBuilder = new StringBuilder();

            // Configure common settings for logging
            var loggerConfiguration = new LoggerConfiguration()
                .Enrich.FromLogContext()
                .MinimumLevel.ControlledBy(levelSwitch)
                .MinimumLevel.Override(LoggingConstants.DefaultSource, GetLogEventLevel(applicationConfiguredLogLevel))
                .MinimumLevel.Override(LoggingConstants.MicrosoftSource, GetLogEventLevel(microsoftConfiguredLogLevel))
                .MinimumLevel.Override(LoggingConstants.SystemSource, GetLogEventLevel(systemConfiguredLogLevel));

            // Configure Console Logger
            if (loggingConfiguration.LogToConsole)
            {
                loggerConfiguration
                    .WriteTo.Console(outputTemplate: outputTemplate, theme: SystemConsoleTheme.Literate);
            }
            else
                logInfoStringBuilder.AppendLine("Console logging disabled");

            // Configure Rolling Log Logger
            if (loggingConfiguration.LogToRollingFile)
            {
                configuredLogDir = !string.IsNullOrEmpty(loggingConfiguration.LogDir) ? loggingConfiguration.LogDir : Directory.GetCurrentDirectory();
                loggerConfiguration
                    .WriteTo.File($"{configuredLogDir}{Path.DirectorySeparatorChar}{appName}-{{Date}}.log", outputTemplate: outputTemplate);

                logInfoStringBuilder.AppendLine($"Writing verbose logs to '{configuredLogDir}'");
            }
            else
                logInfoStringBuilder.AppendLine("Rolling Log logging disabled");

            if (!configuredLogLevelValid)
            {
                logInfoStringBuilder.AppendLine($"Configured console log level invalid; defaulting to {configuredAppLogLevel}");
            }
            else
            {
                logInfoStringBuilder.AppendLine($"Console LogLevel configured to {configuredAppLogLevel}");
            }

            message = logInfoStringBuilder.ToString();
            return loggerConfiguration;
        }

        public static LogEventLevel GetLogEventLevel(this LogLevel logLevel)
        {
            switch (logLevel)
            {
                case LogLevel.Critical:
                    return LogEventLevel.Fatal;

                case LogLevel.Error:
                    return LogEventLevel.Error;
                case LogLevel.Warning:
                    return LogEventLevel.Warning;
                case LogLevel.Information:
                    return LogEventLevel.Information;
                case LogLevel.Debug:
                    return LogEventLevel.Debug;
                case LogLevel.Trace:
                    return LogEventLevel.Verbose;
                default:
                    return LogEventLevel.Error;
            }
        }
    }
}
