import {
    isNil,
    isEmpty,
    isString,
} from 'lodash';
import moment from 'moment-timezone';
import Address from '../models/Address';

/**
 * Formats Durations strings as hh:mm
 * 
 * @param input - Should be a Moment Duration object
 * 
 * @returns {String} - formatted duration
 */
export function displayHhMm(input: any): string {
    if (!moment.isDuration(input)) {
        return '';
    }

    return `${pad(Math.floor(input.asHours()), 2)}:${pad(input.minutes(), 2)}`;
}

/**
 * Formats a mailing address.
 * 
 * @param {Address} address - Address to format
 * 
 * @returns {String} - formatted address with line breaks and such
 */
export function formatAddress(address: Address): string {
    if (isNil(address)) {
        return '';
    }

    const isUnitedStatesAddress = address.country.twoLetterCode === 'US';
    const cityRegionSeparator = isUnitedStatesAddress ? ', ' : ' ';

    return `${address.streetAddress1}${!isEmpty(address.streetAddress2) ? '\n' + address.streetAddress2 + '\n' : ''}
${address.city}${cityRegionSeparator}${isUnitedStatesAddress ? address.region.code : address.region.name} ${address.postalCode}
${address.country.name}`;
}

/**
 * Formats a string representing a decimal number with two decimal places (e.g. for currency amounts).
 * 
 * @param {String} input - string to format
 * 
 * @returns {String}
 */
export function formatWithTwoDecimalPlaces(input: string) {
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

/**
 * Pads a number with leading zeroes until it has reached the specified size.
 * 
 * @param {Number} num - The number to pad
 * @param {Number} size - The desired size, including as many leading zeroes as necessary
 * 
 * @example
 * // returns 05
 * pad(5, 2);
 * 
 * @example
 * // returns 007
 * pad(7, 3);
 * 
 * @example
 * // returns 0042
 * pad(42, 4);
 * 
 * @returns {String}
 */
export function pad(num: number, size: number): string {
    let result = num.toString();

    while (result.length < size) {
        result = `0${result}`;
    }

    return result;
}