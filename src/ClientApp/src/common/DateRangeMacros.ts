import { memoize } from 'lodash';
import moment from 'moment-timezone';
import DateRange from '../models/DateRange';
import DateRangeMacroType from '../models/DateRangeMacroType';

export const dateRangeMacroOptions = new Map<number, string>([
    [DateRangeMacroType.All, 'All'],
    [DateRangeMacroType.Custom, 'Custom'],
    [DateRangeMacroType.Today, 'Today'],
    [DateRangeMacroType.ThisWeek, 'This Week'],
    [DateRangeMacroType.ThisWeekToDate, 'This Week-to-date'],
    [DateRangeMacroType.ThisMonth, 'This Month'],
    [DateRangeMacroType.ThisMonthToDate, 'This Month-to-date'],
    [DateRangeMacroType.ThisQuarter, 'This Quarter'],
    [DateRangeMacroType.ThisQuarterToDate, 'This Quarter-to-date'],
    [DateRangeMacroType.ThisYear, 'This Year'],
    [DateRangeMacroType.ThisYearToDate, 'This Year-to-date'],
    [DateRangeMacroType.ThisYearToLastMonth, 'This Year-to-last-month'],
    [DateRangeMacroType.Yesterday, 'Yesterday'],
    [DateRangeMacroType.LastWeek, 'Last Week'],
    [DateRangeMacroType.LastWeekToDate, 'Last Week-to-date'],
    [DateRangeMacroType.LastMonth, 'Last Month'],
    [DateRangeMacroType.LastMonthToDate, 'Last Month-to-date'],
    [DateRangeMacroType.LastQuarter, 'Last Quarter'],
    [DateRangeMacroType.LastQuarterToDate, 'Last Quarter-to-date'],
    [DateRangeMacroType.LastYear, 'Last Year'],
    [DateRangeMacroType.LastYearToDate, 'Last Year-to-date'],
    [DateRangeMacroType.Since30DaysAgo, 'Since 30 Days Ago'],
    [DateRangeMacroType.Since60DaysAgo, 'Since 60 Days Ago'],
    [DateRangeMacroType.Since90DaysAgo, 'Since 90 Days Ago'],
    [DateRangeMacroType.Since365DaysAgo, 'Since 365 Days Ago'],
    [DateRangeMacroType.NextWeek, 'Next Week'],
    [DateRangeMacroType.NextMonth, 'Next Month'],
    [DateRangeMacroType.NextQuarter, 'Next Quarter'],
    [DateRangeMacroType.NextYear, 'Next Year'],
]);

const userTimeZone = moment.tz.guess();
const todayMoment = moment().tz(userTimeZone).startOf('day');
const todayFormatted = todayMoment.format('YYYY-MM-DD');

const _computeDateRangeFromMacro = (macro: DateRangeMacroType): DateRange => {
    switch (macro) {
        case DateRangeMacroType.Custom:
            return { dateRangeStart: '', dateRangeEnd: '' };

        case DateRangeMacroType.Today:
            return { dateRangeStart: todayFormatted, dateRangeEnd: todayFormatted };

        case DateRangeMacroType.ThisWeek: {
            const weekStart = moment(todayMoment).day(0);
            const weekEnd = moment(todayMoment).day(6);
            return { dateRangeStart: weekStart.format('YYYY-MM-DD'), dateRangeEnd: weekEnd.format('YYYY-MM-DD') };
        }

        case DateRangeMacroType.ThisWeekToDate: {
            const weekStart = moment(todayMoment).day(0);
            return { dateRangeStart: weekStart.format('YYYY-MM-DD'), dateRangeEnd: todayFormatted };
        }

        case DateRangeMacroType.ThisMonth: {
            const monthStart = moment(todayMoment).startOf('month');
            const monthEnd = moment(monthStart).add(1, 'month').subtract(1, 'day');
            return { dateRangeStart: monthStart.format('YYYY-MM-DD'), dateRangeEnd: monthEnd.format('YYYY-MM-DD') };
        }

        case DateRangeMacroType.ThisMonthToDate: {
            const monthStart = moment(todayMoment).startOf('month');
            return { dateRangeStart: monthStart.format('YYYY-MM-DD'), dateRangeEnd: todayFormatted };
        }

        case DateRangeMacroType.ThisQuarter: {
            const quarterStart = moment(todayMoment).startOf('quarter');
            const quarterEnd = moment(quarterStart).add(1, 'quarter').subtract(1, 'day');
            return { dateRangeStart: quarterStart.format('YYYY-MM-DD'), dateRangeEnd: quarterEnd.format('YYYY-MM-DD') };
        }

        case DateRangeMacroType.ThisYear: {
            const yearStart = moment(todayMoment).startOf('year');
            const yearEnd = moment(yearStart).add(1, 'year').subtract(1, 'day');
            return { dateRangeStart: yearStart.format('YYYY-MM-DD'), dateRangeEnd: yearEnd.format('YYYY-MM-DD') };
        }

        case DateRangeMacroType.ThisYearToDate: {
            const yearStart = moment(todayMoment).startOf('year');
            return { dateRangeStart: yearStart.format('YYYY-MM-DD'), dateRangeEnd: todayFormatted };
        }

        case DateRangeMacroType.ThisYearToLastMonth: {
            const yearStart = moment(todayMoment).startOf('year');
            const lastMonthEnd = moment(todayMoment).startOf('month').subtract(1, 'day');
            return { dateRangeStart: yearStart.format('YYYY-MM-DD'), dateRangeEnd: lastMonthEnd.format('YYYY-MM-DD') };
        }

        case DateRangeMacroType.Yesterday: {
            const yesterday = moment(todayMoment).subtract(1, 'day');
            const yesterdayFormatted = yesterday.format('YYYY-MM-DD');
            return { dateRangeStart: yesterdayFormatted, dateRangeEnd: yesterdayFormatted };
        }

        case DateRangeMacroType.LastWeek: {
            const lastWeekStart = moment(todayMoment).day(0).subtract(7, 'days');
            const lastWeekEnd = moment(lastWeekStart).day(6);
            return { dateRangeStart: lastWeekStart.format('YYYY-MM-DD'), dateRangeEnd: lastWeekEnd.format('YYYY-MM-DD') };
        }

        case DateRangeMacroType.LastWeekToDate: {
            const lastWeekStart = moment(todayMoment).day(0).subtract(7, 'days');
            return { dateRangeStart: lastWeekStart.format('YYYY-MM-DD'), dateRangeEnd: todayFormatted };
        }

        case DateRangeMacroType.LastMonth: {
            const lastMonthStart = moment(todayMoment).startOf('month').subtract(1, 'month');
            const lastMonthEnd = moment(todayMoment).startOf('month').subtract(1, 'day');
            return { dateRangeStart: lastMonthStart.format('YYYY-MM-DD'), dateRangeEnd: lastMonthEnd.format('YYYY-MM-DD') };
        }

        case DateRangeMacroType.LastMonthToDate: {
            const lastMonthStart = moment(todayMoment).startOf('month').subtract(1, 'month');
            return { dateRangeStart: lastMonthStart.format('YYYY-MM-DD'), dateRangeEnd: todayFormatted };
        }

        case DateRangeMacroType.LastQuarter: {
            const lastQuarterStart = moment(todayMoment).startOf('quarter').subtract(1, 'quarter');
            const lastQuarterEnd = moment(todayMoment).startOf('quarter').subtract(1, 'day');
            return { dateRangeStart: lastQuarterStart.format('YYYY-MM-DD'), dateRangeEnd: lastQuarterEnd.format('YYYY-MM-DD') };
        }

        case DateRangeMacroType.LastQuarterToDate: {
            const lastQuarterStart = moment(todayMoment).startOf('quarter').subtract(1, 'quarter');
            return { dateRangeStart: lastQuarterStart.format('YYYY-MM-DD'), dateRangeEnd: todayFormatted };
        }

        case DateRangeMacroType.LastYear: {
            const lastYearStart = moment(todayMoment).startOf('year').subtract(1, 'year');
            const lastYearEnd = moment(todayMoment).startOf('year').subtract(1, 'day');
            return { dateRangeStart: lastYearStart.format('YYYY-MM-DD'), dateRangeEnd: lastYearEnd.format('YYYY-MM-DD') };
        }

        case DateRangeMacroType.LastYearToDate: {
            const lastYearStart = moment(todayMoment).startOf('year').subtract(1, 'year');
            return { dateRangeStart: lastYearStart.format('YYYY-MM-DD'), dateRangeEnd: todayFormatted };
        }

        case DateRangeMacroType.Since30DaysAgo: {
            const dateRangeStartMoment = moment(todayMoment).subtract(30, 'days');
            return { dateRangeStart: dateRangeStartMoment.format('YYYY-MM-DD'), dateRangeEnd: todayFormatted };
        }

        case DateRangeMacroType.Since60DaysAgo: {
            const dateRangeStartMoment = moment(todayMoment).subtract(60, 'days');
            return { dateRangeStart: dateRangeStartMoment.format('YYYY-MM-DD'), dateRangeEnd: todayFormatted };
        }

        case DateRangeMacroType.Since90DaysAgo: {
            const dateRangeStartMoment = moment(todayMoment).subtract(90, 'days');
            return { dateRangeStart: dateRangeStartMoment.format('YYYY-MM-DD'), dateRangeEnd: todayFormatted };
        }

        case DateRangeMacroType.Since365DaysAgo: {
            const dateRangeStartMoment = moment(todayMoment).subtract(365, 'days');
            return { dateRangeStart: dateRangeStartMoment.format('YYYY-MM-DD'), dateRangeEnd: todayFormatted };
        }

        case DateRangeMacroType.NextWeek: {
            const dateRangeStartMoment = moment(todayMoment).day(0).add(7, 'days');
            const dateRangeEndMoment = moment(dateRangeStartMoment).day(6);
            return { dateRangeStart: dateRangeStartMoment.format('YYYY-MM-DD'), dateRangeEnd: dateRangeEndMoment.format('YYYY-MM-DD') };
        }

        case DateRangeMacroType.NextMonth: {
            const dateRangeStartMoment = moment(todayMoment).endOf('month').add(1, 'day');
            const dateRangeEndMoment = moment(dateRangeStartMoment).endOf('month');
            return { dateRangeStart: dateRangeStartMoment.format('YYYY-MM-DD'), dateRangeEnd: dateRangeEndMoment.format('YYYY-MM-DD') };
        }

        case DateRangeMacroType.NextQuarter: {
            const dateRangeStartMoment = moment(todayMoment).endOf('quarter').add(1, 'day');
            const dateRangeEndMoment = moment(dateRangeStartMoment).endOf('quarter');
            return { dateRangeStart: dateRangeStartMoment.format('YYYY-MM-DD'), dateRangeEnd: dateRangeEndMoment.format('YYYY-MM-DD') };
        }

        case DateRangeMacroType.NextYear: {
            const dateRangeStartMoment = moment(todayMoment).endOf('year').add(1, 'day');
            const dateRangeEndMoment = moment(dateRangeStartMoment).endOf('year');
            return { dateRangeStart: dateRangeStartMoment.format('YYYY-MM-DD'), dateRangeEnd: dateRangeEndMoment.format('YYYY-MM-DD') };
        }

        case DateRangeMacroType.All:
        default:
            return { dateRangeStart: '2018-01-01', dateRangeEnd: todayFormatted };
    }
};

export const computeDateRangeFromMacro = memoize(_computeDateRangeFromMacro);