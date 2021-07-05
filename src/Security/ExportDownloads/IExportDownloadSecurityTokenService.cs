using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DashAccountingSystemV2.Services.Export;

namespace DashAccountingSystemV2.Security.ExportDownloads
{
    public interface IExportDownloadSecurityTokenService
    {
        Task<string> RequestExportDownloadToken(
            Guid tenantId,
            Guid userId,
            ExportType exportType);

        Task<ExportDownloadAuthenticationTicket> RedeemExportDownloadToken(string token);
    }
}
