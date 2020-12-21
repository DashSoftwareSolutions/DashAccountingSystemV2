using System;
using System.Linq;
using System.Text.RegularExpressions;

namespace DashAccountingSystemV2.Extensions
{
    public static class StringExtensions
    {
        public static string EnsureTrailingSlash(this string str)
        {
            if (string.IsNullOrWhiteSpace(str))
                return str;

            return !str.EndsWith("/") ? str + "/" : str;
        }

        public static string GetConnectionStringComponent(this string fullConnectionString, string component)
        {
            return fullConnectionString.Split(new char[] { ';' }, StringSplitOptions.RemoveEmptyEntries)
                .Where(s => s.StartsWith(component, StringComparison.OrdinalIgnoreCase))
                .Select(s => s.Replace($"{component}=", string.Empty, StringComparison.OrdinalIgnoreCase))
                .FirstOrDefault();
        }

        public static string GetTrimmedOrEmptyString(this string input)
        {
            return input.HasValue() ? input.Trim() : string.Empty;
        }

        public static bool HasValue(this string str)
        {
            return !string.IsNullOrEmpty(str);
        }

        public static string MaskPassword(
            this string connectionString,
            int numTrailingCharactersToReveal = 4,
            char maskCharacter = '*')
        {
            if (string.IsNullOrWhiteSpace(connectionString))
                return connectionString;

            var passwordClauseMatch = s_passwordClausePattern.Match(connectionString);

            if (string.IsNullOrEmpty(passwordClauseMatch?.Value))
                return connectionString;

            var passwordClause = passwordClauseMatch.Value;
            var passwordClauseParts = passwordClause.Split(new char[] { '=' });
            var updatedPasswordClause = string.Join("=",
                passwordClauseParts[0],
                passwordClauseParts[1].MaskSecretValue(numTrailingCharactersToReveal, maskCharacter));

            return connectionString.Replace(passwordClause, updatedPasswordClause);
        }

        public static string MaskSecretValue(
            this string secret,
            int numTrailingCharactersToReveal = 4,
            char maskCharacter = '*')
        {
            if (string.IsNullOrWhiteSpace(secret)) return secret;

            var actualNumTrailingCharactersToReveal = Math.Min(
                Math.Max(numTrailingCharactersToReveal, 0), // ensure we have a non-negative number
                secret.Length);                             // ensure we do not exceed the bounds of the string

            // for really short strings or no trailing characters to reveal, just return 8 mask characters always
            if (actualNumTrailingCharactersToReveal == 0)
                return new string(maskCharacter, 8);

            var leadingMaskChars = Enumerable.Repeat(maskCharacter, 4).ToArray();
            char[] trailingChars;

            if (secret.Length >= actualNumTrailingCharactersToReveal)
            {
                trailingChars = secret.Substring(secret.Length - actualNumTrailingCharactersToReveal).ToCharArray();
            }
            else
            {
                trailingChars = Enumerable.Repeat(maskCharacter, actualNumTrailingCharactersToReveal).ToArray();
            }

            char[] allChars = new char[4 + actualNumTrailingCharactersToReveal];
            Buffer.BlockCopy(leadingMaskChars, 0, allChars, 0, 8);
            Buffer.BlockCopy(trailingChars, 0, allChars, 8, actualNumTrailingCharactersToReveal * 2);
            return new string(allChars);
        }

        private static readonly Regex s_passwordClausePattern =
            new Regex("password\\s*=\\s*([^,;]*)", RegexOptions.Compiled | RegexOptions.IgnoreCase);

        public static DateTime? TryParseAsDateTime(this string viewModelDateTime, bool isUtc = false)
        {
            if (string.IsNullOrWhiteSpace(viewModelDateTime)) return null;

            DateTime? returnDateTime = null;

            if (long.TryParse(viewModelDateTime, out var parsedUnixTimestamp))
            {
                returnDateTime = parsedUnixTimestamp.ToDateTime();
            }
            else if (DateTime.TryParse(viewModelDateTime, out var parsedDate))
            {
                returnDateTime = parsedDate;
            }

            if (returnDateTime.HasValue)
            {
                if (isUtc)
                    return returnDateTime.Value.ToUniversalTime();
                else
                    return returnDateTime;
            }

            return null;
        }
    }
}
