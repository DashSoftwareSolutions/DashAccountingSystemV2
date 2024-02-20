using System.Collections.Immutable;
using NodaTime;
using NodaTime.TimeZones;
using DashAccountingSystemV2.Extensions;
using DashAccountingSystemV2.Services.Time;
using TimeZone = DashAccountingSystemV2.Models.TimeZone;

namespace DashAccountingSystemV2.Repositories
{
    public class TimeZoneRepository : ITimeZoneRepository
    {
		private static readonly string _PacificTime = "America/Los_Angeles";
		private static readonly string _BuenosAiresTime = "America/Argentina/Buenos_Aires";
		private static readonly string _ManilaTime = "Asia/Manila";
		private static readonly string _BerlinTime = "Europe/Berlin";
		private static readonly string _HongKongTime = "Asia/Hong_Kong";

		private readonly ITimeProvider _timeProvider = null;

        public TimeZoneRepository(ITimeProvider timeProvider)
        {
            _timeProvider = timeProvider;
        }

        public Task<IEnumerable<TimeZone>> GetTimeZones()
        {
            var tzdbSource = TzdbDateTimeZoneSource.Default;
            var windowsTzSource = DateTimeZoneProviders.Bcl;

            var windowsToIanaMap = windowsTzSource.Ids
                .Select(tzid => new KeyValuePair<string, string>(
                    tzid,
                    tzdbSource.WindowsMapping.MapZones.FirstOrDefault(mz => mz.WindowsId == tzid)?.TzdbIds.FirstOrDefault()))
                .Where(z => z.Value != null)
                .ToDictionary(kvp => kvp.Key, kvp => kvp.Value);

            var windowsTimeZoneData = windowsToIanaMap.Keys
                  .Select(winTzId =>
                      new KeyValuePair<string, TimeZoneDto>(
                          winTzId,
                          new TimeZoneDto(
                            windowsToIanaMap[winTzId],
                            windowsTzSource.GetZoneOrNull(winTzId) as BclDateTimeZone)))
                .ToDictionary(kvp => kvp.Key, kvp => kvp.Value);

			var ianaToWindowsMap = windowsToIanaMap
				.Select(kvp => new KeyValuePair<string, TimeZoneDto>(kvp.Value, windowsTimeZoneData[kvp.Key]))
				.ToDictionary(kvp => kvp.Key, kvp => kvp.Value);

			// Ensure U.S. Pacific, Hong Kong, Berlin, Manila and Buenos Aires Time Zones are included
			if (!ianaToWindowsMap.ContainsKey(_PacificTime))
				ianaToWindowsMap.Add(
					_PacificTime,
					new TimeZoneDto(_PacificTime, "Pacific Time (US & Canada)", _timeProvider));

			if (!ianaToWindowsMap.ContainsKey(_BuenosAiresTime))
				ianaToWindowsMap.Add(
					_BuenosAiresTime,
					new TimeZoneDto(_BuenosAiresTime, "Buenos Aires (Argentina)", _timeProvider));

			if (!ianaToWindowsMap.ContainsKey(_ManilaTime))
				ianaToWindowsMap.Add(
					_ManilaTime,
					new TimeZoneDto(_ManilaTime, "Manila (Philippines)", _timeProvider));

			if (!ianaToWindowsMap.ContainsKey(_BerlinTime))
				ianaToWindowsMap.Add(
					_BerlinTime,
					new TimeZoneDto(_BerlinTime, "Berlin (Germany)", _timeProvider));

			if (!ianaToWindowsMap.ContainsKey(_HongKongTime))
				ianaToWindowsMap.Add(
					_HongKongTime,
					new TimeZoneDto(_HongKongTime, "Hong Kong", _timeProvider));

			return Task.FromResult(
				ianaToWindowsMap
					.Values
					.OrderBy(tz => tz.UtcOffsetForSort)
					.ThenBy(tz => tz.DisplayName)
					.Select(tzDTO => tzDTO.ToTimeZone())
					.ToImmutableArray() as IEnumerable<TimeZone>);
		}

        internal class TimeZoneDto
		{
			private readonly ITimeProvider _timeProvider = null;

			// Absolute Must haves (will be inherited from main TimeZone model)
			public string Id { get; set; }
			public string DisplayName { get; set; }

			// Properties available From base NodaTime DateTimeZone
			public TimeSpan MaxOffset { get; set; }
			public TimeSpan MinOffset { get; set; }

			// Properties that are only available if we have a mapped Windows (.NET BCL) Time Zone for the TZDB/IANA/Olson Time Zone
			public string WindowsZoneId { get; set; }
			public string DaylightName { get; set; }
			public string StandardName { get; set; }
			public TimeSpan BaseUtcOffset { get; set; }
			public bool SupportsDaylightSavingsTime { get; set; }

			internal Offset UtcOffsetForSort
			{
				get
				{
					return BaseUtcOffset == TimeSpan.Zero
						? DateTimeZoneProviders.Tzdb[Id].GetUtcOffset(Instant.FromDateTimeUtc(DateTime.UtcNow))
						: Offset.FromTimeSpan(BaseUtcOffset);
				}
			}

			public TimeZoneDto(ITimeProvider timeProvider)
			{
				_timeProvider = timeProvider;
			}

			public TimeZoneDto(
				string tzdbTimeZoneId,
				string baseDisplayName,
				ITimeProvider timeProvider)
				: this(timeProvider)
			{
				var tzdbTimeZone = GetTzdbTimeZone(tzdbTimeZoneId);

				if (string.IsNullOrWhiteSpace(baseDisplayName))
					throw new ArgumentNullException(nameof(baseDisplayName));

				var currentOffset = tzdbTimeZone
					.GetUtcOffset(Instant.FromDateTimeUtc(_timeProvider.UtcNow))
					.ToTimeSpan();

				Id = tzdbTimeZoneId;
				DisplayName = $"(UTC{currentOffset.ToHMString()}) {baseDisplayName}";
				MinOffset = tzdbTimeZone.MinOffset.ToTimeSpan();
				MaxOffset = tzdbTimeZone.MaxOffset.ToTimeSpan();
			}

			public TimeZoneDto(string tzdbTimeZoneId, BclDateTimeZone bclDateTimeZone)
			{
				var tzdbTimeZone = GetTzdbTimeZone(tzdbTimeZoneId);

				if (bclDateTimeZone == null)
					throw new ArgumentNullException(nameof(bclDateTimeZone));

				Id = tzdbTimeZoneId;
				MinOffset = bclDateTimeZone.MinOffset.ToTimeSpan();
				MaxOffset = bclDateTimeZone.MaxOffset.ToTimeSpan();
				WindowsZoneId = bclDateTimeZone.Id;
				DisplayName = bclDateTimeZone.DisplayName;
				DaylightName = bclDateTimeZone.OriginalZone?.DaylightName;
				StandardName = bclDateTimeZone.OriginalZone?.StandardName;

				BaseUtcOffset = bclDateTimeZone.OriginalZone?.BaseUtcOffset
					?? tzdbTimeZone
						.GetUtcOffset(Instant.FromDateTimeUtc(_timeProvider.UtcNow))
						.ToTimeSpan();

				SupportsDaylightSavingsTime = bclDateTimeZone.OriginalZone?.SupportsDaylightSavingTime ?? false;
			}

			private DateTimeZone GetTzdbTimeZone(string tzdbTimeZoneId)
			{
				if (string.IsNullOrWhiteSpace(tzdbTimeZoneId))
					throw new ArgumentNullException(nameof(tzdbTimeZoneId), "Must specify TZDB (IANA/Olson) Time Zone ID");

				var tzdbTimeZone = DateTimeZoneProviders.Tzdb.GetZoneOrNull(tzdbTimeZoneId);

				if (tzdbTimeZone == null)
					throw new ArgumentException(
						nameof(tzdbTimeZoneId),
						string.Format("'{0}' does not seem to be a valid TZDB (IANA/Olson) Time Zone ID", tzdbTimeZoneId));

				return tzdbTimeZone;
			}

			internal TimeZone ToTimeZone()
			{
				var safeDisplayName = DisplayName;

				// Hong Kong Fix -- remove it from Asia/Shanghai zone's display name
				if (safeDisplayName.Contains("Hong Kong") && Id != "Asia/Hong_Kong")
					safeDisplayName = safeDisplayName.Replace("Hong Kong, ", string.Empty);

				return new TimeZone(Id, safeDisplayName);
			}
		}
    }
}
