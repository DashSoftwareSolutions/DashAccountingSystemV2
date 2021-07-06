using System;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using DashAccountingSystemV2.Services.Export;

namespace DashAccountingSystemV2.ViewModels
{
    public class ExportRequestViewModel
    {
        public Guid TenantId { get; set; }

        [JsonConverter(typeof(StringEnumConverter))]
        public ExportType ExportType { get; set; }

        [JsonConverter(typeof(StringEnumConverter))]
        public ExportFormat ExportFormat { get; set; }
    }
}
