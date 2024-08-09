const defaultPrecision = 0.001;

/**
 * Helper function for checking two numbers for equality.
 * 'cause ... you know ... floating point number issues! ;-)
 * Adapted from: https://stackoverflow.com/a/49261488
 * @param {Number} n1
 * @param {Number} n2
 * @param {Number} precision
 * @returns {Number}
 */
export const numbersAreEqualWithPrecision = (n1: number, n2: number, precision: number = defaultPrecision): boolean => {
    return Math.abs(n1 - n2) <= precision;
}
