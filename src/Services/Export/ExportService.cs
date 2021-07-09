using System;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using DashAccountingSystemV2.Models;
using DashAccountingSystemV2.Security.ExportDownloads;
using DashAccountingSystemV2.Services.Caching;
using DashAccountingSystemV2.Services.Export.DataExporters;

namespace DashAccountingSystemV2.Services.Export
{
    public class ExportService : IExportService
    {
        private readonly ILoggerFactory _loggerFactory = null;
        private readonly ILogger _logger = null;
        private readonly IExtendedDistributedCache _cache = null;
        private readonly IExportDownloadSecurityTokenService _securityTokenService = null;

        public ExportService(
            ILoggerFactory loggerFactory,
            IExtendedDistributedCache cache,
            IExportDownloadSecurityTokenService securityTokenService)
        {
            _loggerFactory = loggerFactory;
            _logger = loggerFactory.CreateLogger<ExportService>();
            _cache = cache;
            _securityTokenService = securityTokenService;
        }

        public async Task<ExportResultDto> GetDataExport<TUnderlyingData>(
            ExportRequestParameters parameters,
            TUnderlyingData data) where TUnderlyingData : class
        {
            try
            {
                var dataExporter = GetDataExporter<TUnderlyingData>(parameters);
                var exportedData = await dataExporter.GetDataExport(parameters, data);

                if (exportedData != null)
                {
                    var cacheKey = $"{parameters.TenantId}/{exportedData.FileName}";
                    await _cache.SetAsync(cacheKey, exportedData.Content, TimeSpan.FromMinutes(5));

                    var downloadAccessToken = await _securityTokenService.RequestExportDownloadToken(
                        parameters.TenantId,
                        parameters.RequestingUserId,
                        parameters.ExportType);

                    return new ExportResultDto(parameters, exportedData.FileName, downloadAccessToken);
                }
                else
                {
                    _logger.LogDebug("Data exporter returned no content");
                    return new ExportResultDto(parameters, "Error generating requested data export");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating requested data export");
                return new ExportResultDto(parameters, "Error generating requested data export");
            }
        }

        // TODO: This might move to a separate Factory class
        private IDataExporter<TUnderlyingData> GetDataExporter<TUnderlyingData>(ExportRequestParameters parameters)
            where TUnderlyingData : class
        {
            switch (parameters.ExportType)
            {
                case ExportType.BalanceSheetReport:
                    if (typeof(TUnderlyingData) != typeof(BalanceSheetReportDto))
                    {
                        throw new ArgumentException("Unexpected kind of data transfer object supplied to Balance Sheet Report Export request");
                    }

                    if (parameters.ExportFormat != ExportFormat.XLSX)
                    {
                        throw new NotImplementedException($"No support for exporting Balance Sheet Report to format {parameters.ExportFormat}");
                    }

                    return new BalanceSheetReportExcelExporter(_loggerFactory.CreateLogger<BalanceSheetReportExcelExporter>()) as IDataExporter<TUnderlyingData>;

                case ExportType.ProfitAndLossReport:
                    if (typeof(TUnderlyingData) != typeof(ProfitAndLossReportDto))
                    {
                        throw new ArgumentException("Unexpected kind of data transfer object supplied to Profit & Loss Report Export request");
                    }

                    if (parameters.ExportFormat != ExportFormat.XLSX)
                    {
                        throw new NotImplementedException($"No support for exporting Profit & Loss Report to format {parameters.ExportFormat}");
                    }

                    return new ProfitAndLossReportExcelExporter(_loggerFactory.CreateLogger<ProfitAndLossReportExcelExporter>()) as IDataExporter<TUnderlyingData>;

                default:
                    throw new ArgumentOutOfRangeException(nameof(parameters.ExportType), $"No support for export type {parameters.ExportType}");
            }
        }
    }
}
