using System;
using NodaTime;

namespace DashAccountingSystemV2.Extensions
{
    public static class DateTimeExtensions
    {
        /// <summary>
        /// This method will produce a DateTime with .Kind set to DateTimeKind.Utc.  If the input DateTimeKind is Unspecified, then
        /// it will assume Utc and merely set .Kind.  If it is Local, then it will convert to the Utc timezone.  If Utc is already set
        /// then it will do nothing.
        /// </summary>
        public static DateTime AsUtc(this DateTime d)
        {
            switch (d.Kind)
            {
                case DateTimeKind.Local:
                    return TimeZoneInfo.ConvertTime(d, TimeZoneInfo.FindSystemTimeZoneById("UTC"));
                case DateTimeKind.Unspecified:
                    return DateTime.SpecifyKind(d, DateTimeKind.Utc);
                default:
                    return d;
            }
        }

        /// <summary>
        /// This method will produce a DateTime with .Kind set to DateTimeKind.Utc.  If the input DateTimeKind is Unspecified, then
        /// it will assume Utc and merely set .Kind.  If it is Local, then it will convert to the Utc timezone.  If Utc is already set
        /// or if d is null, then it will do nothing.
        /// </summary>
        public static DateTime? AsUtc(this DateTime? d)
        {
            return d.HasValue ? d.Value.AsUtc() : d;
        }

        /// <summary>
        /// This method will produce a DateTime object with d.Kind set to DateTimeKind.Unspecified from a long that represents a Unix timestamp.
        /// </summary>
        public static DateTime ToDateTime(this long l)
        {
            DateTime d = Constants.UnixEpochUtc;
            return d.AddSeconds(l);
        }

        /// <summary>
        /// Converts a <see cref="TimeSpan"/> to [+/-]HH:mm format
        /// </summary>
        /// <remarks>
        /// * Always includes sign (+ or -)
        /// * Always includes leading 0 for single digit hours
        /// </remarks>
        /// <param name="timespan"></param>
        /// <returns></returns>
        public static string ToHMString(this TimeSpan timespan)
        {
            var isNegative = timespan.Ticks < 0;
            var sign = isNegative ? "-" : "+";
            var actualTimeSpan = isNegative ? timespan.Negate() : timespan;
            return $"{sign}{actualTimeSpan.Hours.ToString("00")}:{actualTimeSpan.Minutes.ToString("00")}";
        }

        /// <summary>
        /// This method will not do a converstion for you, and d.Kind must be DateTimeKind.Utc or it will throw ArgumentException.
        /// </summary>
        public static long ToUnixTimestamp(this DateTime d, bool milliseconds = false)
        {
            if (d.Kind != DateTimeKind.Utc)
                throw new ArgumentException("We don't serve your kind here!");

            var elapsedSinceEpoch = d - Constants.UnixEpochUtc;
            return (long)(milliseconds ? elapsedSinceEpoch.TotalMilliseconds : elapsedSinceEpoch.TotalSeconds);
        }

        /// <summary>
        /// This method will not do a converstion for you, and d.Kind must be DateTimeKind.Utc or it will throw ArgumentException.
        /// </summary>
        public static long? ToUnixTimestamp(this DateTime? d, bool milliseconds = false)
        {
            if (d.HasValue) return d.Value.ToUnixTimestamp(milliseconds);

            return null;
        }

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
