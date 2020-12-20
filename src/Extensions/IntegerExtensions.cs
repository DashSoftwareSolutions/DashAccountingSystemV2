using System;

namespace DashAccountingSystemV2.Extensions
{
    public static class IntegerExtensions
    {
        public static int CoalesceInRange(this int value, int lowerLimit, int upperLimit)
        {
            if (upperLimit < lowerLimit)
                throw new ArgumentOutOfRangeException(nameof(upperLimit), "upperLimit must not be less than lowerLimit");

            var satisfiesLowerLimit = value >= lowerLimit;
            var satisfiesUpperLimit = value <= upperLimit;

            if (satisfiesLowerLimit && satisfiesUpperLimit)
                return value;
            else if (!satisfiesLowerLimit)
                return lowerLimit;
            else // doesn't satisfy upper limit
                return upperLimit;
        }

        public static int EnsureIsPositive(this int value, int defaultValue)
        {
            if (defaultValue <= 0)
                throw new ArgumentOutOfRangeException(nameof(defaultValue), "defaultValue must be positive");

            if (value > 0)
                return value;

            return defaultValue;
        }
    }
}
