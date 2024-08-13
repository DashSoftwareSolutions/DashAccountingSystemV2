import { Duration } from 'luxon';
import {
    displayHhMm,
    isStringNullOrWhiteSpace,
    pad,
} from '../stringUtils';

describe('displayHhMm()', () => {
    it.each([
        {
            durationSpec: {
                hours: 1,
                minutes: 2,
            },
            expected: '01:02',
        },
        {
            durationSpec: {
                hours: 12,
                minutes: 13,
            },
            expected: '12:13',
        },
        {
            durationSpec: {
                days: 2,
                hours: 2,
                minutes: 2,
            },
            expected: '50:02',
        },
    ])('Formats $durationSpec as $expected', ({ durationSpec, expected }) => {
        expect(displayHhMm(Duration.fromObject(durationSpec))).toEqual(expected);
    });
});

describe('isStringNullOrWhiteSpace()', () => {
    it('Handles `undefined`', () => {
        expect(isStringNullOrWhiteSpace(undefined)).toBe(true);
    });

    it('Handles `null`', () => {
        expect(isStringNullOrWhiteSpace(null)).toBe(true);
    });

    it('Handles an empty string', () => {
        expect(isStringNullOrWhiteSpace('')).toBe(true);
    });

    it('Handles an all whitespace string', () => {
        expect(isStringNullOrWhiteSpace('  \t\t  \r\n \t ')).toBe(true);
    });

    it('Correctly returns `false` for a string with non-whitespace characters in it', () => {
        expect(isStringNullOrWhiteSpace('Hello, World!')).toBe(false);
    });
});

describe('pad()', () => {
    it.each([
        {
            number: 5,
            size: 2,
            expected: '05',
        },
        {
            number: 7,
            size: 3,
            expected: '007',
        },
        {
            number: 42,
            size: 4,
            expected: '0042',
        },
    ])('pad($number, $size) => $expected', ({ number, size, expected }) => {
        expect(pad(number, size)).toEqual(expected);
    });
});
