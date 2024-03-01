using System.Globalization;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace DashAccountingSystemV2.ViewModels.Serialization
{
    /// <summary>
    /// Custom JSON Converter for nullable <c>DateTime?</c> values
    /// that serializes the values as either <c>null</c> or <c>YYYY-MM-DD</c> strings.
    /// </summary>
    public class JsonNullableDateConverter : JsonConverter<DateTime?>
    {
        private static readonly CultureInfo _enUS = new CultureInfo("en-US");

        public override bool HandleNull => true;

        public override bool CanConvert(Type objectType)
        {
            return objectType == typeof(DateTime) || objectType == typeof(DateTime?);
        }

        public override DateTime? Read(
            ref Utf8JsonReader reader,
            Type typeToConvert,
            JsonSerializerOptions options)
        {
            var value = reader.GetString();

            if (value == null)
                return null;

            if (!string.IsNullOrWhiteSpace(value) &&
                DateTime.TryParseExact(value, "yyyy-MM-dd", _enUS, DateTimeStyles.None, out var date))
            {
                return date;
            }

            throw new JsonException("Invalid date format");
        }

        public override void Write(
            Utf8JsonWriter writer,
            DateTime? dateTimeValue,
            JsonSerializerOptions options)
        {
            if (!dateTimeValue.HasValue)
            {
                writer.WriteNullValue();
                return;
            }

            writer.WriteStringValue(dateTimeValue.Value.ToString("yyyy-MM-dd", _enUS));
        }
    }
}

