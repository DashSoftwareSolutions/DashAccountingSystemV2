using DashAccountingSystemV2.BackEnd.Security.ExportDownloads;
using DashAccountingSystemV2.BackEnd.Services.Caching;

namespace DashAccountingSystemV2.BackEnd.Services.Export
{
    public class ExportService(
        IExtendedDistributedCache cache,
        IExportDownloadSecurityTokenService securityTokenService,
        ILogger<ExportService> logger)
        : IExportService
    {
        public async Task<ExportResultDto> GetDataExport<TUnderlyingData>(
            ExportRequestParameters parameters,
            TUnderlyingData data) where TUnderlyingData : class
        {
            // TODO: Generate the extracts

            var downloadAccessToken = await securityTokenService.RequestExportDownloadToken(
                parameters.TenantId,
                parameters.RequestingUserId,
                parameters.ExportType);

            return new ExportResultDto(parameters, /*exportedData.FileName*/"foo.xlsx", downloadAccessToken);
        }
    }
}
