import {
    isNil,
    isEmpty,
    isString,
} from 'lodash';

import Address from '../models/Address';

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
 * Utils.isStringNullOrWhiteSpace('');
 *
 * @example
 * // returns true
 * Utils.isStringNullOrWhiteSpace('  ');
 *
 * @example
 * // return false
 * Utils.isStringNullOrWhiteSpace('foo');
 *
 * @example
 * // return false
 * Utils.isStringNullOrWhiteSpace('123');
 *
 * @example
 * // return true (we require the input to actually be of type string)
 * Utils.isStringNullOrWhiteSpace(123);
 *
 * @returns {Boolean}
 */
export function isStringNullOrWhiteSpace(input: any) {
    return !isString(input) || isEmpty(input) || /^\s+$/.test(input);
}