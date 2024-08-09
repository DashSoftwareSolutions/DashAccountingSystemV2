/**
 * Time Zone
 */
export default interface TimeZone {
    /**
     * TZDB / IANA / Olson Time Zone ID, e.g. "America/Los_Angeles"
     */
    id: string;

    /**
     * Friendly name, e.g. "(UTC-08:00) Pacific Time (US & Canada)"
     */
    displayName: string;
}
