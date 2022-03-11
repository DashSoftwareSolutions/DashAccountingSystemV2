using System;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using DashAccountingSystemV2.Security.ExportDownloads;
using DashAccountingSystemV2.Services.Caching;
using static DashAccountingSystemV2.Services.Caching.Constants;

namespace DashAccountingSystemV2.Services.Export
{
    public class ExportService : IExportService
    {
        private readonly IExtendedDistributedCache _cache = null;
        private readonly IDataExporterFactory _dataExporterFactory = null;
        private readonly IExportDownloadSecurityTokenService _securityTokenService = null;
        private readonly ILogger _logger = null;

        public ExportService(
            IExtendedDistributedCache cache,
            IDataExporterFactory dataExporterFactory,
            IExportDownloadSecurityTokenService securityTokenService,
            ILogger<ExportService> logger)
        {
            _cache = cache;
            _dataExporterFactory = dataExporterFactory;
            _securityTokenService = securityTokenService;
            _logger = logger;
        }

        public async Task<ExportResultDto> GetDataExport<TUnderlyingData>(
            ExportRequestParameters parameters,
            TUnderlyingData data) where TUnderlyingData : class
        {
            try
            {
                var dataExporter = _dataExporterFactory.CreateDataExporter(typeof(TUnderlyingData), parameters) as IDataExporter<TUnderlyingData>;
                var exportedData = await dataExporter.GetDataExport(parameters, data);

                if (exportedData != null)
                {
                    var cacheKey = $"{ApplicationCacheKeyPrefix}/{parameters.TenantId}/{exportedData.FileName}";
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
    }
}
