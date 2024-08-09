namespace DashAccountingSystemV2.BackEnd.Models
{
    public class TimeZone
    {
        /// <summary>
        /// IANA / Olson / TZDB ID for the Time Zone (e.g. America/Los_Angeles)
        /// </summary>
        /// <remarks>
        /// For a more suitable, shorter and friendlier list, we're actually
        /// starting from the Windows / .NET Base Class Library (BCL) Time Zone
        /// master list, and not the full IANA database.  We then use the
        /// Canonical IANA Zone that corresponds with the Windows Zone.
        /// </remarks>
        public string Id { get; set; }

        /// <summary>
        /// Friendly Display Name for the Time Zone (e.g. "(UTC-08:00) Pacific Time (US & Canada)")
        /// </summary>
        public string DisplayName { get; set; }

        public TimeZone() { }

        public TimeZone(string id, string displayName)
        {
            Id = id;
            DisplayName = displayName;
        }
    }
}
