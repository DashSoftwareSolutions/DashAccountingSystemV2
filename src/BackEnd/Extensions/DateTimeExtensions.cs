using NodaTime;

namespace DashAccountingSystemV2.BackEnd.Extensions
{
    public static class DateTimeExtensions
    {
        /// <summary>
        /// This method will produce a DateTime with <c>.Kind</c> set to <c>DateTimeKind.Utc.</c><br />
        /// * If the input's <c>.Kind</c> is <c>Unspecified</c>, then it will assume UTC and merely set <c>.Kind</c>.<br />
        /// * If it is <c>Local</c>, then it will convert to the UTC time zone.<br />
        /// * If <c>Utc</c> is already set then it will do nothing.
        /// </summary>
        public static DateTime AsUtc(this DateTime d) =>
            d.Kind switch
            {
                DateTimeKind.Local => TimeZoneInfo.ConvertTime(d, TimeZoneInfo.FindSystemTimeZoneById("UTC")),
                DateTimeKind.Unspecified => DateTime.SpecifyKind(d, DateTimeKind.Utc),
                _ => d,
            };

        /// <summary>
        /// This method will produce a DateTime with <c>.Kind</c> set to <c>DateTimeKind.Utc.</c><br />
        /// * If the input's <c>.Kind</c> is <c>Unspecified</c>, then it will assume UTC and merely set <c>.Kind</c>.<br />
        /// * If it is <c>Local</c>, then it will convert to the UTC time zone.<br />
        /// * If <c>Utc</c> is already set then it will do nothing.
        /// </summary>
        public static DateTime? AsUtc(this DateTime? d) => d.HasValue ? d.Value.AsUtc() : d;

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
            return $"{sign}{actualTimeSpan.Hours:00}:{actualTimeSpan.Minutes:00}";
        }

        /// <summary>
        /// Shifts a UTC Date/Time into the specified Time Zone
        /// </summary>
        /// <param name="utcDateTime">UTC <see cref="DateTime"/></param>
        /// <param name="tzdbTimeZoneId">
        /// <see href="https://en.wikipedia.org/wiki/Tz_database">IANA / Olson / TZDB</see> ID for the Time Zone (e.g. <b><c>America/Los_Angeles</c></b> for U.S. Pacific Time)
        /// </param>
        /// <returns><see cref="DateTime"/> in the target time zone (with its <c>.Kind</c> property set to <c><see cref="DateTimeKind.Unspecified"/></c>)</returns>
        /// <exception cref="InvalidOperationException"></exception>
        /// <exception cref="ArgumentException"></exception>
        public static DateTime WithTimeZone(this DateTime utcDateTime, string tzdbTimeZoneId)
        {
            if (utcDateTime.Kind != DateTimeKind.Utc)
                throw new InvalidOperationException("This operation can only be performed on UTC Date/Times");

            var timeZone = DateTimeZoneProviders.Tzdb.GetZoneOrNull(tzdbTimeZoneId);

            return timeZone == null
                ? throw new ArgumentException(
                    $"'{tzdbTimeZoneId}' is not a valid IANA Time Zone Database ID",
                    nameof(tzdbTimeZoneId))
                : LocalDateTime
                    .FromDateTime(utcDateTime)
                    .InZoneStrictly(DateTimeZone.Utc)
                    .WithZone(timeZone)
                    .ToDateTimeUnspecified();
        }

        /// <summary>
        /// Changes the <b><c><see cref="DateTime.Kind"/></c></b> property of the <c>DateTime</c> object to <b><c><see cref="DateTimeKind.Unspecified"/></c></b>.
        /// </summary>
        /// <remarks>
        /// Why you might reasonably ask?  'cause Npgsql and Entity Framework are being <em><strong>SUPER LAME</strong></em>
        /// and will not allow a <c>DateTime</c> value with <c>Kind</c> set to <c><see cref="DateTimeKind.Utc"/></c>
        /// to be written to a <c>TIMESTAMP WITHOUT TIME ZONE</c> column.<br />
        /// <br />
        /// Likely I have some trust issues and have had time zones bite me too many times.
        /// I suppose I could use <c>TIMESTAMP WITH TIME ZONE</c> typed columns, but I think I like the DB
        /// not trying to be smart about my values and just store them and retrieve them the way I specify.
        /// </remarks>
        /// <param name="dateTime"><c>DateTime</c> object</param>
        /// <returns>Same <c>DateTime</c> object with its <b><c><see cref="DateTime.Kind"/></c></b> property set to <b><c><see cref="DateTimeKind.Unspecified"/></c></b></returns>
        public static DateTime Unkind(this DateTime dateTime)
        {
            return DateTime.SpecifyKind(dateTime, DateTimeKind.Unspecified);
        }
    }
}
