using System;
using DashAccountingSystemV2.Services.Export;

namespace DashAccountingSystemV2.Security.ExportDownloads
{
    public class ExportDownloadAuthenticationTicket
    {
        public Guid TenantId { get; set; }

        public Guid UserId { get; set; }

        public ExportType ExportType { get; set; }
    }
}
