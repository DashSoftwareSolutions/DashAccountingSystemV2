import {
    isEmpty,
    isString,
} from 'lodash';

/**
 * Formats a string representing a decimal number with two decimal places (e.g. for currency amounts).
 * 
 * @param {String} input - string to format
 * 
 * @returns {String}
 */
export function formatWithTwoDecimalPlaces(input: string): string {
    if (isEmpty(input)) {
        return input;
    }

    if (!input.includes('.')) {
        return `${input}.00`;
    }

    if (/\.\d$/.test(input)) {
        return `${input}0`;
    }

    return input;
}

/**
 * Determines whether or not a string contains valid data.
 * Intended to provide similar semantics as C# `String.IsNullOrWhiteSpace()`
 *
 * @param {String} input - string to check
 *
 * @example
 * // returns true
 * isStringNullOrWhiteSpace('');
 *
 * @example
 * // returns true
 * isStringNullOrWhiteSpace('  ');
 *
 * @example
 * // return false
 * isStringNullOrWhiteSpace('foo');
 *
 * @example
 * // return false
 * isStringNullOrWhiteSpace('123');
 *
 * @example
 * // return true (we require the input to actually be of type `string`)
 * isStringNullOrWhiteSpace(123);
 *
 * @returns {Boolean}
 */
export function isStringNullOrWhiteSpace(input: any) {
    return !isString(input) || isEmpty(input) || /^\s+$/.test(input);
}
