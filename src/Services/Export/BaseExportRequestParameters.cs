using System;

namespace DashAccountingSystemV2.Services.Export
{
    public abstract class BaseExportRequestParameters
    {
        public Guid TenantId { get; set; }

        public ExportFormat ExportFormat { get; set; }

        public ExportType ExportType { get; set; }
    }
}
