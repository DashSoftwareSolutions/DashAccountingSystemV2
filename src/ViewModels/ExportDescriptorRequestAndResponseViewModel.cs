using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using DashAccountingSystemV2.Services.Export;

namespace DashAccountingSystemV2.ViewModels
{
    public class ExportDescriptorRequestAndResponseViewModel
    {
        [JsonConverter(typeof(StringEnumConverter))]
        public ExportFormat Format { get; set; }

        public string FileName { get; set; }

        public string Token { get; set; }
    }
}
