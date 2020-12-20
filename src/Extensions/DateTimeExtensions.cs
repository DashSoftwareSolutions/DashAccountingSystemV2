using System;
using NodaTime;

namespace DashAccountingSystemV2.Extensions
{
    public static class DateTimeExtensions
    {
        public static DateTime WithTimeZone(this DateTime utcDateTime, string tzdbTimeZoneId)
        {
            if (utcDateTime.Kind != DateTimeKind.Utc)
                throw new InvalidOperationException("This operation can only be performed on UTC Date/Times");

            var timeZone = DateTimeZoneProviders.Tzdb.GetZoneOrNull(tzdbTimeZoneId);

            if (timeZone == null)
                throw new ArgumentException(
                    $"'{tzdbTimeZoneId}' is not a valid IANA Time Zone Database ID",
                    nameof(tzdbTimeZoneId));

            return LocalDateTime
                .FromDateTime(utcDateTime)
                .InZoneStrictly(DateTimeZone.Utc)
                .WithZone(timeZone)
                .ToDateTimeUnspecified();
        }
    }
}
