import { memoize } from 'lodash';
import {
    DateTime,
} from 'luxon';
import {
    DateRange,
    DateRangeMacroType,
} from '../models';

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

const today = DateTime.now();
const todayFormatted = DateTime.now().toISODate();
const MONDAY = 1; // ISO Standard
const SUNDAY = 7; // ISO Standard

const _computeDateRangeFromMacro = (macro: DateRangeMacroType): DateRange => {
    switch (macro) {
        case DateRangeMacroType.Custom:
            return { dateRangeStart: '', dateRangeEnd: '' };

        case DateRangeMacroType.Today:
            return { dateRangeStart: todayFormatted, dateRangeEnd: todayFormatted };

        case DateRangeMacroType.ThisWeek: {
            const weekStart = today.set({ weekday: MONDAY });
            const weekEnd = today.set({ weekday: SUNDAY });
            return { dateRangeStart: weekStart.toISODate(), dateRangeEnd: weekEnd.toISODate() };
        }

        case DateRangeMacroType.ThisWeekToDate: {
            const weekStart = today.set({ weekday: MONDAY });
            return { dateRangeStart: weekStart.toISODate(), dateRangeEnd: todayFormatted };
        }

        case DateRangeMacroType.ThisMonth: {
            const monthStart = today.startOf('month');
            const monthEnd = today.endOf('month');
            return { dateRangeStart: monthStart.toISODate(), dateRangeEnd: monthEnd.toISODate() };
        }

        case DateRangeMacroType.ThisMonthToDate: {
            const monthStart = today.startOf('month');
            return { dateRangeStart: monthStart.toISODate(), dateRangeEnd: todayFormatted };
        }

        case DateRangeMacroType.ThisQuarter: {
            const quarterStart = today.startOf('quarter');
            const quarterEnd = today.endOf('quarter');
            return { dateRangeStart: quarterStart.toISODate(), dateRangeEnd: quarterEnd.toISODate() };
        }

        case DateRangeMacroType.ThisQuarterToDate: {
            const quarterStart = today.startOf('quarter');
            return { dateRangeStart: quarterStart.toISODate(), dateRangeEnd: todayFormatted };
        }

        case DateRangeMacroType.ThisYear: {
            const yearStart = today.startOf('year');
            const yearEnd = today.endOf('year');
            return { dateRangeStart: yearStart.toISODate(), dateRangeEnd: yearEnd.toISODate() };
        }

        case DateRangeMacroType.ThisYearToDate: {
            const yearStart = today.startOf('year');
            return { dateRangeStart: yearStart.toISODate(), dateRangeEnd: todayFormatted };
        }

        case DateRangeMacroType.ThisYearToLastMonth: {
            const yearStart = today.startOf('year');
            const lastMonthEnd = today.startOf('month').minus({ days: 1 });
            return { dateRangeStart: yearStart.toISODate(), dateRangeEnd: lastMonthEnd.toISODate() };
        }

        case DateRangeMacroType.Yesterday: {
            const yesterday = today.minus({ days: 1 });
            const yesterdayFormatted = yesterday.toISODate();
            return { dateRangeStart: yesterdayFormatted, dateRangeEnd: yesterdayFormatted };
        }

        case DateRangeMacroType.LastWeek: {
            const lastWeekStart = today.set({ weekday: MONDAY }).minus({ days: 7 });
            const lastWeekEnd = lastWeekStart.set({ weekday: SUNDAY });
            return { dateRangeStart: lastWeekStart.toISODate(), dateRangeEnd: lastWeekEnd.toISODate() };
        }

        case DateRangeMacroType.LastWeekToDate: {
            const lastWeekStart = today.set({ weekday: MONDAY }).minus({ days: 7 });
            return { dateRangeStart: lastWeekStart.toISODate(), dateRangeEnd: todayFormatted };
        }

        case DateRangeMacroType.LastMonth: {
            const lastMonthStart = today.startOf('month').minus({ months: 1 });
            const lastMonthEnd = lastMonthStart.endOf('month');
            return { dateRangeStart: lastMonthStart.toISODate(), dateRangeEnd: lastMonthEnd.toISODate() };
        }

        case DateRangeMacroType.LastMonthToDate: {
            const lastMonthStart = today.startOf('month').minus({ months: 1 });
            return { dateRangeStart: lastMonthStart.toISODate(), dateRangeEnd: todayFormatted };
        }

        case DateRangeMacroType.LastQuarter: {
            const lastQuarterStart = today.startOf('quarter').minus({ quarters: 1 });
            const lastQuarterEnd = lastQuarterStart.endOf('quarter');
            return { dateRangeStart: lastQuarterStart.toISODate(), dateRangeEnd: lastQuarterEnd.toISODate() };
        }

        case DateRangeMacroType.LastQuarterToDate: {
            const lastQuarterStart = today.startOf('quarter').minus({ quarters: 1 });
            return { dateRangeStart: lastQuarterStart.toISODate(), dateRangeEnd: todayFormatted };
        }

        case DateRangeMacroType.LastYear: {
            const lastYearStart = today.startOf('year').minus({ years: 1 });
            const lastYearEnd = lastYearStart.endOf('year');
            return { dateRangeStart: lastYearStart.toISODate(), dateRangeEnd: lastYearEnd.toISODate() };
        }

        case DateRangeMacroType.LastYearToDate: {
            const lastYearStart = today.startOf('year').minus({ years: 1 });
            return { dateRangeStart: lastYearStart.toISODate(), dateRangeEnd: todayFormatted };
        }

        case DateRangeMacroType.Since30DaysAgo: {
            const dateRangeStartMoment = today.minus({ days: 30 });
            return { dateRangeStart: dateRangeStartMoment.toISODate(), dateRangeEnd: todayFormatted };
        }

        case DateRangeMacroType.Since60DaysAgo: {
            const dateRangeStartMoment = today.minus({ days: 60 });
            return { dateRangeStart: dateRangeStartMoment.toISODate(), dateRangeEnd: todayFormatted };
        }

        case DateRangeMacroType.Since90DaysAgo: {
            const dateRangeStartMoment = today.minus({ days: 90 });
            return { dateRangeStart: dateRangeStartMoment.toISODate(), dateRangeEnd: todayFormatted };
        }

        case DateRangeMacroType.Since365DaysAgo: {
            const dateRangeStartMoment = today.minus({ days: 365 });
            return { dateRangeStart: dateRangeStartMoment.toISODate(), dateRangeEnd: todayFormatted };
        }

        case DateRangeMacroType.NextWeek: {
            const dateRangeStartMoment = today.set({ weekday: MONDAY }).plus({ days: 7 });
            const dateRangeEndMoment = dateRangeStartMoment.set({ weekday: SUNDAY });
            return { dateRangeStart: dateRangeStartMoment.toISODate(), dateRangeEnd: dateRangeEndMoment.toISODate() };
        }

        case DateRangeMacroType.NextMonth: {
            const dateRangeStartMoment = today.endOf('month').plus({ days: 1 });
            const dateRangeEndMoment = dateRangeStartMoment.endOf('month');
            return { dateRangeStart: dateRangeStartMoment.toISODate(), dateRangeEnd: dateRangeEndMoment.toISODate() };
        }

        case DateRangeMacroType.NextQuarter: {
            const dateRangeStartMoment = today.endOf('quarter').plus({ days: 1 });
            const dateRangeEndMoment = dateRangeStartMoment.endOf('quarter');
            return { dateRangeStart: dateRangeStartMoment.toISODate(), dateRangeEnd: dateRangeEndMoment.toISODate() };
        }

        case DateRangeMacroType.NextYear: {
            const dateRangeStartMoment = today.endOf('year').plus({ days: 1 });
            const dateRangeEndMoment = dateRangeStartMoment.endOf('year');
            return { dateRangeStart: dateRangeStartMoment.toISODate(), dateRangeEnd: dateRangeEndMoment.toISODate() };
        }

        case DateRangeMacroType.All:
        default:
            return { dateRangeStart: '2018-01-01', dateRangeEnd: todayFormatted };
    }
};

export const computeDateRangeFromMacro = memoize(_computeDateRangeFromMacro);