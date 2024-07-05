import DateTimeString from './dateTimeString.model';

export default interface DateRange {
    /**
     * Range Start Date in YYYY-MM-DD format.
     */
    dateRangeStart: DateTimeString;
    /**
     * Range End Date in in YYYY-MM-DD format.
     */
    dateRangeEnd: DateTimeString;
}
