using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace DashAccountingSystemV2.ViewModels.Serialization
{
    public class JsonIsoDateTimeConverter : IsoDateTimeConverter
    {
        public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
        {
            if (value == null)
            {
                writer.WriteNull();
                return;
            }

            base.WriteJson(writer, value, serializer);
        }
    }
}
