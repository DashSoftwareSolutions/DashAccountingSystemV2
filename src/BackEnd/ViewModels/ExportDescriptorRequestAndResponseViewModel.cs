using System.Text.Json.Serialization;
using DashAccountingSystemV2.BackEnd.Services.Export;

namespace DashAccountingSystemV2.BackEnd.ViewModels
{
    public class ExportDescriptorRequestAndResponseViewModel
    {
        [JsonConverter(typeof(JsonStringEnumConverter<ExportFormat>))]
        public ExportFormat Format { get; set; }

        public string FileName { get; set; }

        public string Token { get; set; }
    }
}
