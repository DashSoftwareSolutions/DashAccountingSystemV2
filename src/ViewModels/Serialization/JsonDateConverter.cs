using System;
using System.Globalization;
using Newtonsoft.Json;

namespace DashAccountingSystemV2.ViewModels.Serialization
{
    public class JsonDateConverter : JsonConverter
    {
        private static readonly CultureInfo _enUS = new CultureInfo("en-US");

        public override bool CanConvert(Type objectType)
        {
            return objectType == typeof(DateTime) || objectType == typeof(DateTime?);
        }

        public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
        {
            // Handle nullables
            if (reader.Value == null)
                return null;

            if (reader.Value is string value && !string.IsNullOrWhiteSpace(value))
            {
                if (DateTime.TryParseExact(value, "yyyy-MM-dd", _enUS, DateTimeStyles.None, out var date))
                {
                    return date;
                }
            }

            throw new JsonSerializationException("Invalid date format");
        }

        public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
        {
            if (value == null)
            {
                writer.WriteNull();
                return;
            }

            if (value is DateTime date)
            {
                writer.WriteValue(date.ToString("yyyy-MM-dd", _enUS));
                return;
            }

            throw new JsonSerializationException("Invalid value type (should be DateTime)");
        }
    }
}
