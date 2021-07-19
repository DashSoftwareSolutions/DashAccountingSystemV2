export default interface TimeZone {
    id: string; // TZDB / IANA / Olson Time Zone ID, e.g. "America/Los_Angeles"
    displayName: string; // Friendly name, e.g. "(UTC-08:00) Pacific Time (US & Canada)"
}