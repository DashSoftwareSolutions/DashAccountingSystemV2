using System;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Reflection;

namespace DashAccountingSystemV2.Extensions
{
    /// <summary>
    /// This class contains useful methods for extracting working with Enumerations.
    /// Many of them are geared towards extracting information from custom attributes which decorate enum values.
    /// These methods are not in fact proper extension methods per se, but this seemed to be the best place and manner in which to define them.
    /// </summary>
    public static class EnumerationExtensions
    {
        /// <summary>
        /// Converts nullable integer to a nullable enum type, only if the integer matches one of the defined enum values
        /// </summary>
        /// <typeparam name="TEnum">Must be a type of enum</typeparam>
        /// <param name="enumIntValue">nullable integer</param>
        /// <returns>nullable enum value: will be not null if the integer argument is not null and corresponds to a valid enum value</returns>
        public static TEnum? GetEnum<TEnum>(int? enumIntValue)
            where TEnum : struct, IComparable, IFormattable, IConvertible
        {
            return GetEnum<TEnum, int>(enumIntValue);
        }

        /// <summary>
        /// Converts nullable short integer to a nullable enum type, only if the integer matches one of the defined enum values
        /// </summary>
        /// <typeparam name="TEnum">Must be a type of enum</typeparam>
        /// <param name="enumIntValue">nullable short integer</param>
        /// <returns>nullable enum value: will be not null if the short integer argument is not null and corresponds to a valid enum value</returns>
        public static TEnum? GetEnum<TEnum>(short? enumIntValue)
            where TEnum : struct, IComparable, IFormattable, IConvertible
        {
            return GetEnum<TEnum, short>(enumIntValue);
        }

        private static TEnum? GetEnum<TEnum, TUnderlyingInteger>(TUnderlyingInteger? enumIntValue)
            where TEnum : struct, IComparable, IFormattable, IConvertible
            where TUnderlyingInteger : struct
        {
            var enumType = typeof(TEnum);

            if (!enumType.GetTypeInfo().IsEnum ||
                !enumIntValue.HasValue ||
                !Enum.IsDefined(enumType, enumIntValue.Value))
            {
                return null;
            }

            var values = Enum.GetValues(enumType);
            TEnum[] enumValues = (TEnum[])values;
            TUnderlyingInteger[] enumIntValues = (TUnderlyingInteger[])values;
            return enumValues[Array.IndexOf(enumIntValues, enumIntValue.Value)];
        }

        /// <summary>
        /// Gets the Name property of an enum value that is decorated with a <see cref="System.ComponentModel.DataAnnotations.DisplayAttribute"/> and Name is not null or empty.
        /// Returns the default string conversion of the enum value otherwise.
        /// </summary>
        /// <typeparam name="TEnum">Must be a type of enum</typeparam>
        /// <param name="enumValue">Enum value</param>
        /// <returns>string: The Name property of the Display Attribute or the default enum value string conversion otherwise</returns>
        public static string GetDisplayName<TEnum>(TEnum enumValue)
            where TEnum : struct, IComparable, IFormattable, IConvertible
        {
            var enumValueAsString = enumValue.ToString();
            var displayAttr = GetDisplayAttribute<TEnum>(enumValueAsString);
            var displayName = displayAttr?.GetName();

            return !string.IsNullOrEmpty(displayName)
                ? displayName
                : enumValueAsString;
        }

        /// <summary>
        /// Gets the Description property of an enum value that is decorated with a <see cref="System.ComponentModel.DataAnnotations.DisplayAttribute"/> and Name is not null or empty.
        /// Returns the default string conversion of the enum value otherwise.
        /// </summary>
        /// <typeparam name="TEnum">Must be a type of enum</typeparam>
        /// <param name="enumValue">Enum value</param>
        /// <returns>string: The Description property of the Display Attribute if available, or the Name property of the Display Attribute if available, or the default enum value string conversion otherwise</returns>
        public static string GetDisplayDescription<TEnum>(TEnum enumValue)
            where TEnum : struct, IComparable, IFormattable, IConvertible
        {
            var enumValueAsString = enumValue.ToString();
            var displayAttr = GetDisplayAttribute<TEnum>(enumValueAsString);
            var displayDescription = displayAttr?.GetDescription();

            if (!string.IsNullOrEmpty(displayDescription))
                return displayDescription;

            var displayName = displayAttr?.GetName();

            return !string.IsNullOrEmpty(displayName)
                ? displayName
                : enumValueAsString;
        }

        /// <summary>
        /// Gets the Order property of an enum value that is decorated with a <see cref="System.ComponentModel.DataAnnotations.DisplayAttribute"/> if it is not null; returns the underlying enum integer value otherwise.
        /// </summary>
        /// <typeparam name="TEnum">Must be a type of enum</typeparam>
        /// <param name="enumValue">Enum value</param>
        /// <returns>integer: The Order property of the Display Attribute if available, or the underlying integer value of the enum value otherwise</returns>
        public static int GetDisplayOrder<TEnum>(TEnum enumValue)
            where TEnum : struct, IComparable, IFormattable, IConvertible
        {
            var displayAttr = GetDisplayAttribute<TEnum>(enumValue.ToString());
            return displayAttr?.GetOrder() ?? Convert.ToInt32(enumValue);
        }

        /// <summary>
        /// Gets the <see cref="System.ComponentModel.DataAnnotations.DisplayAttribute"/> from an enum value.
        /// </summary>
        /// <typeparam name="TEnum">Must be a type of enum</typeparam>
        /// <param name="enumValue">Enum value</param>
        /// <returns><see cref="System.ComponentModel.DataAnnotations.DisplayAttribute"/> if found or null otherwise</returns>
        public static DisplayAttribute GetDisplayAttribute<TEnum>(TEnum enumValue)
            where TEnum : struct, IComparable, IFormattable, IConvertible
        {
            return GetCustomAttribute<TEnum, DisplayAttribute>(enumValue.ToString());
        }

        /// <summary>
        /// Gets the <see cref="System.ComponentModel.DataAnnotations.DisplayAttribute"/> from an enum value.
        /// </summary>
        /// <typeparam name="TEnum">Must be a type of enum</typeparam>
        /// <param name="enumValueAsString">Enum value converted to a string (e.g. by calling ToString() on it)</param>
        /// <returns><see cref="System.ComponentModel.DataAnnotations.DisplayAttribute"/> if found or null otherwise</returns>
        public static DisplayAttribute GetDisplayAttribute<TEnum>(string enumValueAsString)
            where TEnum : struct, IComparable, IFormattable, IConvertible
        {
            return GetCustomAttribute<TEnum, DisplayAttribute>(enumValueAsString);
        }

        /// <summary>
        /// Gets the specified type of custom attribute from an enum value
        /// </summary>
        /// <typeparam name="TEnum">Must be a type of enum</typeparam>
        /// <typeparam name="TAttribute">Must be a type of <see cref="System.Attribute"/></typeparam>
        /// <param name="enumValue">Enum value</param>
        /// <returns>Found attribute or null if not found</returns>
        public static TAttribute GetCustomAttribute<TEnum, TAttribute>(TEnum enumValue)
            where TEnum : struct, IComparable, IFormattable, IConvertible
            where TAttribute : Attribute
        {
            return GetCustomAttribute<TEnum, TAttribute>(enumValue.ToString());
        }

        /// <summary>
        /// Gets the specified type of custom attribute from an enum value
        /// </summary>
        /// <typeparam name="TEnum">Must be a type of enum</typeparam>
        /// <typeparam name="TAttribute">Must be a type of <see cref="System.Attribute"/></typeparam>
        /// <param name="enumValueAsString">Enum value converted to a string (e.g. by calling ToString() on it)</param>
        /// <returns>Found attribute or null if not found</returns>
        public static TAttribute GetCustomAttribute<TEnum, TAttribute>(string enumValueAsString)
            where TEnum : struct, IComparable, IFormattable, IConvertible
            where TAttribute : Attribute
        {
            MemberInfo[] memberInfo = typeof(TEnum).GetMember(enumValueAsString);

            if (memberInfo != null && memberInfo.Length > 0)
            {
                var attrs = memberInfo[0].GetCustomAttributes(typeof(TAttribute), false);

                var firstAttr = attrs.FirstOrDefault();
                if (firstAttr != null)
                {
                    return (TAttribute)firstAttr;
                }
            }

            return null;
        }
    }
}
