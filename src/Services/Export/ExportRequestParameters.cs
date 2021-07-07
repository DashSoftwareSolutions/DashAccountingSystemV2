using System;

namespace DashAccountingSystemV2.Services.Export
{
    public class ExportRequestParameters
    {
        public Guid TenantId { get; set; }

        public Guid RequestingUserId { get; set; }

        public ExportFormat ExportFormat { get; set; }

        public ExportType ExportType { get; set; }
    }
}
