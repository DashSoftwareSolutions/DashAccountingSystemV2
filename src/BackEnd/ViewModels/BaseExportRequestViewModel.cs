using System.Text.Json.Serialization;
using DashAccountingSystemV2.BackEnd.Services.Export;

namespace DashAccountingSystemV2.BackEnd.ViewModels
{
    public class BaseExportRequestViewModel
    {
        public Guid TenantId { get; set; }

        [JsonConverter(typeof(JsonStringEnumConverter<ExportFormat>))]
        public ExportFormat ExportFormat { get; set; }

        [JsonConverter(typeof(JsonStringEnumConverter<ExportType>))]
        public ExportType ExportType { get; set; }
    }
}
