using DashAccountingSystemV2.BackEnd.Services.Export;

namespace DashAccountingSystemV2.BackEnd.Security.ExportDownloads
{
    public interface IExportDownloadSecurityTokenService
    {
        Task<string> RequestExportDownloadToken(
            Guid tenantId,
            Guid userId,
            ExportType exportType);

        Task<ExportDownloadAuthenticationTicket?> RedeemExportDownloadToken(string token);
    }
}
