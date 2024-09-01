using System.Text.Json;
using System.Text.Json.Serialization;

namespace DashAccountingSystemV2.BackEnd.ViewModels.Serialization
{
    public class JsonNullableTimeSpanConverter : JsonConverter<TimeSpan?>
    {
        public override TimeSpan? Read(
            ref Utf8JsonReader reader,
            Type typeToConvert,
            JsonSerializerOptions options)
        {
            var value = reader.GetString();

            if (value == null)
                return null;

            if (!string.IsNullOrWhiteSpace(value) &&
                TimeSpan.TryParse(value, out var timeSpan))
                return timeSpan;

            throw new JsonException("Invalid time span format");
        }

        public override void Write(
            Utf8JsonWriter writer,
            TimeSpan? value,
            JsonSerializerOptions options)
        {
            if (!value.HasValue)
            {
                writer.WriteNullValue();
                return;
            }

            writer.WriteStringValue(value.Value.ToString("hh:mm:ss"));
        }
    }
}
