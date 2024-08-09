using DashAccountingSystemV2.BackEnd.Extensions;
using DashAccountingSystemV2.BackEnd.Security.ExportDownloads;
using DashAccountingSystemV2.BackEnd.Services.Caching;
using static DashAccountingSystemV2.BackEnd.Services.Caching.Constants;

namespace DashAccountingSystemV2.BackEnd.Services.Export
{
    public class ExportService(
        IExtendedDistributedCache cache,
        IDataExporterFactory dataExporterFactory,
        IExportDownloadSecurityTokenService securityTokenService,
        ILogger<ExportService> logger)
        : IExportService
    {
        public async Task<ExportResultDto> GetDataExport<TUnderlyingData>(
            ExportRequestParameters parameters,
            TUnderlyingData data) where TUnderlyingData : class
        {
            var dataExporter = dataExporterFactory.CreateDataExporter(typeof(TUnderlyingData), parameters) as IDataExporter<TUnderlyingData>;
            var exportedData = await dataExporter!.GetDataExport(parameters, data);

            if (exportedData != null &&
                !string.IsNullOrEmpty(exportedData.FileName) &&
                exportedData.Content.HasAny())
            {
                var cacheKey = $"{ApplicationCacheKeyPrefix}/{parameters.TenantId}/{exportedData.FileName}";
                await cache.SetAsync(cacheKey, exportedData.Content, TimeSpan.FromMinutes(5));

                var downloadAccessToken = await securityTokenService.RequestExportDownloadToken(
                    parameters.TenantId,
                    parameters.RequestingUserId,
                    parameters.ExportType);

                return new ExportResultDto(parameters, exportedData.FileName, downloadAccessToken);
            }
            else
            {
                logger.LogDebug("Data exporter returned no content");
                return new ExportResultDto(parameters, "Error generating requested data export");
            }
        }
    }
}
