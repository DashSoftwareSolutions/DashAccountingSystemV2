namespace DashAccountingSystemV2.Extensions
{
    public static class TimeSpanExtensions
    {
        private enum TimeUnit
        {
            Hours,
            Minutes,
        }

        private static string GetUnit(TimeUnit unitType, bool isPlural, bool abbreviate)
        {
            // TODO: i18n/l10n

            switch (unitType)
            {
                case TimeUnit.Hours:
                    if (isPlural)
                    {
                        return abbreviate ? "hrs" : "hours";
                    }

                    return abbreviate ? "hr" : "hour";

                case TimeUnit.Minutes:
                    if (isPlural)
                    {
                        return abbreviate ? "mins" : "minutes";
                    }

                    return abbreviate ? "min" : "minute";

                default:
                    return string.Empty;
            }
        }

        public static string HumanizeHoursAndMinutes(this TimeSpan timeSpan, bool abbreviateUnits = true)
        {
            var hours = timeSpan.Hours;
            var minutes = timeSpan.Minutes;
            var minutesUnit = GetUnit(TimeUnit.Minutes, minutes > 1, abbreviateUnits);
            var isOneHourOrMore = hours >= 1;

            if (isOneHourOrMore)
            {
                var hoursUnit = GetUnit(TimeUnit.Hours, hours > 1, abbreviateUnits);

                if (minutes == 0)
                {
                    return $"{hours} {hoursUnit}";
                }

                return $"{hours} {hoursUnit} {minutes} {minutesUnit}";
            }

            return $"{minutes} {minutesUnit}";
        }
    }
}
