import {
    isEmpty,
    isString,
} from 'lodash';

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