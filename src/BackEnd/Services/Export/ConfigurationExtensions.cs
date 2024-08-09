using DashAccountingSystemV2.BackEnd.Models;
using DashAccountingSystemV2.BackEnd.Services.Export.DataExporters;

namespace DashAccountingSystemV2.BackEnd.Services.Export
{
    public static class ConfigurationExtensions
    {
        public static IServiceCollection AddExportService(this IServiceCollection services)
        {
            // Data Exporters
            services.AddTransient<BalanceSheetReportExcelExporter>();
            services.AddTransient<InvoicePdfExporter>();
            services.AddTransient<ProfitAndLossReportExcelExporter>();

            // Data Exporter Factory
            services.AddSingleton<IDataExporterFactory, DataExporterFactory>();

            // Data Exporter Factory Method delegate
            services.AddSingleton(CreateDataExporter);

            // Export Service
            services.AddSingleton<IExportService, ExportService>();

            return services;
        }

        private static Func<Type, ExportRequestParameters, IDataExporter> CreateDataExporter(IServiceProvider serviceProvider)
        {
            var logger = serviceProvider.GetRequiredService<ILogger<DataExporterFactory>>();

            return new Func<Type, ExportRequestParameters, IDataExporter>(
                (typeOfDataModel, exportRequestParameters) =>
                {
                    switch (exportRequestParameters.ExportType)
                    {
                        case ExportType.BalanceSheetReport:
                            if (typeOfDataModel != typeof(BalanceSheetReportDto))
                            {
                                throw new ArgumentException("Unexpected kind of data transfer object supplied to Balance Sheet Report Export request");
                            }

                            if (exportRequestParameters.ExportFormat != ExportFormat.XLSX)
                            {
                                throw new NotImplementedException($"No support for exporting Balance Sheet Report to format {exportRequestParameters.ExportFormat}");
                            }

                            return serviceProvider.GetRequiredService<BalanceSheetReportExcelExporter>();

                        case ExportType.Invoice:
                            if (typeOfDataModel != typeof(Invoice))
                            {
                                throw new ArgumentException("Unexpected kind of data transfer object supplied to Invoice Export request");
                            }

                            if (exportRequestParameters.ExportFormat != ExportFormat.PDF)
                            {
                                throw new NotImplementedException($"No support for exporting Invoices to format {exportRequestParameters.ExportFormat}");
                            }

                            return serviceProvider.GetRequiredService<InvoicePdfExporter>();

                        case ExportType.ProfitAndLossReport:
                            if (typeOfDataModel != typeof(ProfitAndLossReportDto))
                            {
                                throw new ArgumentException("Unexpected kind of data transfer object supplied to Profit & Loss Report Export request");
                            }

                            if (exportRequestParameters.ExportFormat != ExportFormat.XLSX)
                            {
                                throw new NotImplementedException($"No support for exporting Profit & Loss Report to format {exportRequestParameters.ExportFormat}");
                            }

                            return serviceProvider.GetRequiredService<ProfitAndLossReportExcelExporter>();

                        default:
                            throw new InvalidOperationException($"No support for export type {exportRequestParameters.ExportType}");
                    }
                }
            );
        }
    }
}
