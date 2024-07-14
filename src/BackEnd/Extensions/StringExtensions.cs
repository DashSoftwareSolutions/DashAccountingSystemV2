using System.Diagnostics;
using System.Text;
using System.Text.RegularExpressions;

namespace DashAccountingSystemV2.BackEnd.Extensions
{
    public static partial class StringExtensions
    {
        public static string EnsureTrailingSlash(this string str)
        {
            if (string.IsNullOrWhiteSpace(str))
                return str;

            return !str.EndsWith('/') ? $"{str}/" : str;
        }

        public static string? GetConnectionStringComponent(this string fullConnectionString, string component)
        {
            return fullConnectionString.Split([';'], StringSplitOptions.RemoveEmptyEntries)
                .Where(s => s.StartsWith(component, StringComparison.OrdinalIgnoreCase))
                .Select(s => s.Replace($"{component}=", string.Empty, StringComparison.OrdinalIgnoreCase))
                .FirstOrDefault();
        }

        public static string GetTrimmedOrEmptyString(this string input)
        {
            return !string.IsNullOrWhiteSpace(input) ? input.Trim() : string.Empty;
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
            var passwordClauseParts = passwordClause.Split(['=']);
            var updatedPasswordClause = string.Join("=",
                passwordClauseParts[0],
                passwordClauseParts[1].MaskSecretValue(numTrailingCharactersToReveal, maskCharacter));

            return connectionString.Replace(passwordClause, updatedPasswordClause);
        }

        public static string? MaskSecretValue(
            this string? secret,
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

        [GeneratedRegex("password\\s*=\\s*([^,;]*)", RegexOptions.IgnoreCase | RegexOptions.Compiled, "en-US")]
        private static partial Regex ConnectionStringPasswordRegex();

        private static readonly Regex s_passwordClausePattern = ConnectionStringPasswordRegex();

        /// <summary>
        /// Performs Unicode Normalization
        /// </summary>
        /// <remarks>
        /// The commented out live implementation can be problematic, especially in cross-platform scenarios (or at least it was as of a few years ago).
        /// For now, <see cref="ReplaceKnownUnicodeLigatures(string)"/> is doing all the work for a Poor Man's version.
        /// </remarks>
        /// <param name="input"></param>
        /// <returns></returns>
        public static string RemoveDiacritics(this string input)
        {
            if (input == null) return null;

            var replaced = input.ReplaceKnownUnicodeLigatures();
            return replaced; // short-circuit actual normalization for now, due to all the trouble it is causing

            // Another poor man's attempt found on Stack Overflow.  Probably not quite the right thing to do in all scenarios.
            //byte[] bytes = Encoding.GetEncoding("Cyrillic").GetBytes(replaced);
            //return Encoding.ASCII.GetString(bytes);

            // "Real" code that tries to do the "right thing" using the .NET APIs designed for this
            // but was having issues, especially in cross-platform scenarios, but even with inconsistent behavior
            // between debugging via Visual Studio versus running on command line via `dotnet run`
            //var normalizedString = replaced.Normalize(NormalizationForm.FormD);
            //var stringBuilder = new StringBuilder(replaced.Length);

            //foreach (var c in normalizedString)
            //{
            //    var unicodeCategory = CharUnicodeInfo.GetUnicodeCategory(c);
            //    if (unicodeCategory != UnicodeCategory.NonSpacingMark)
            //    {
            //        stringBuilder.Append(c);
            //    }
            //}

            //return stringBuilder.ToString().Normalize(NormalizationForm.FormC);
        }

        public static IEnumerable<TEnum> ParseCommaSeparatedEnumValues<TEnum>(this string? commaSeparatedEnumList) where TEnum : struct
        {
            if (string.IsNullOrWhiteSpace(commaSeparatedEnumList))
                return [];

            return commaSeparatedEnumList
                .Split([','], StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
                .Select(s =>
                {
                    if (Enum.TryParse<TEnum>(s, out var res))
                        return (Parsed: true, Value: res);

                    return (Parsed: false, Value: res);
                })
                .Where(s => s.Parsed)
                .Select(s => s.Value);
        }

        public static IEnumerable<Guid> ParseCommaSeparatedGuids(this string? commaSeparatedGuidList)
        {
            if (string.IsNullOrWhiteSpace(commaSeparatedGuidList))
                return [];

#pragma warning disable CS8629 // Nullable value type may be null.
            return commaSeparatedGuidList
                .Split([','], StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
                .Select(s => Guid.TryParse(s, out Guid parsed) ? parsed : (Guid?)null)
                .Where(theGuid => theGuid.HasValue)
                .Select(theGuid => theGuid.Value); // we already filtered to the ones that have a value, so we're good here! =)
#pragma warning restore CS8629 // Nullable value type may be null.
        }

        public static IEnumerable<uint>? ParseCommaSeparatedIntegers(this string? commaSeparatedIntegerList)
        {
            if (string.IsNullOrWhiteSpace(commaSeparatedIntegerList))
                return null;

#pragma warning disable CS8629 // Nullable value type may be null.
            return commaSeparatedIntegerList
                .Split([','], StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
                .Select(s => uint.TryParse(s, out uint parsed) ? parsed : (uint?)null)
                .Where(theInt => theInt.HasValue)
                .Select(theInt => theInt.Value); // we already filtered to the ones that have a value, so we're good here! =)
#pragma warning restore CS8629 // Nullable value type may be null.
        }

        public static IEnumerable<uint>? ParseCommaSeparatedIntegers(this IEnumerable<string>? commaSeparatedIntegerLists)
            => commaSeparatedIntegerLists == null
                ? null
                : string.Join(",", commaSeparatedIntegerLists).ParseCommaSeparatedIntegers();

        /// <summary>
        /// Returns string Enumerable from CSV string parameter 
        /// </summary>
        /// <param name="str"></param>
        /// <returns></returns>
        public static IEnumerable<string> ParseCommaSeparatedValues(this string? str)
        {
            return string.IsNullOrWhiteSpace(str)
                ? Enumerable.Empty<string>()
                : str.Split([','], StringSplitOptions.RemoveEmptyEntries);
        }

        /// <summary>
        /// Returns a new string in which all occurrences of a specified string in the current instance are replaced with another 
        /// specified string according the type of search to use for the specified string.
        /// </summary>
        /// <remarks>
        /// Borrowed from https://stackoverflow.com/questions/6275980/string-replace-ignoring-case
        /// </remarks>
        /// <param name="str">The string performing the replace method.</param>
        /// <param name="oldValue">The string to be replaced.</param>
        /// <param name="newValue">The string replace all occurrences of <paramref name="oldValue"/>. 
        /// If value is equal to <c>null</c>, than all occurrences of <paramref name="oldValue"/> will be removed from the <paramref name="str"/>.</param>
        /// <param name="comparisonType">One of the enumeration values that specifies the rules for the search.</param>
        /// <returns>A string that is equivalent to the current string except that all instances of <paramref name="oldValue"/> are replaced with <paramref name="newValue"/>. 
        /// If <paramref name="oldValue"/> is not found in the current instance, the method returns the current instance unchanged.</returns>
        [DebuggerStepThrough]
        public static string Replace(this string str,
            string oldValue, string @newValue,
            StringComparison comparisonType)
        {

            // Check inputs.
            if (str == null)
            {
                // Same as original .NET C# string.Replace behavior.
                throw new ArgumentNullException(nameof(str));
            }
            if (str.Length == 0)
            {
                // Same as original .NET C# string.Replace behavior.
                return str;
            }
            if (oldValue == null)
            {
                // Same as original .NET C# string.Replace behavior.
                throw new ArgumentNullException(nameof(oldValue));
            }
            if (oldValue.Length == 0)
            {
                // Same as original .NET C# string.Replace behavior.
                throw new ArgumentException("String cannot be of zero length.");
            }

            // Prepare string builder for storing the processed string.
            // Note: StringBuilder has a better performance than String by 30-40%.
            StringBuilder resultStringBuilder = new StringBuilder(str.Length);

            // Analyze the replacement: replace or remove.
            bool isReplacementNullOrEmpty = string.IsNullOrEmpty(@newValue);

            // Replace all values.
            const int valueNotFound = -1;
            int foundAt;
            int startSearchFromIndex = 0;
            while ((foundAt = str.IndexOf(oldValue, startSearchFromIndex, comparisonType)) != valueNotFound)
            {
                // Append all characters until the found replacement.
                int charsUntilReplacement = foundAt - startSearchFromIndex;
                bool isNothingToAppend = charsUntilReplacement == 0;
                if (!isNothingToAppend)
                {
                    resultStringBuilder.Append(str, startSearchFromIndex, charsUntilReplacement);
                }


                // Process the replacement.
                if (!isReplacementNullOrEmpty)
                {
                    resultStringBuilder.Append(@newValue);
                }

                // Prepare start index for the next search.
                // This needed to prevent infinite loop, otherwise method always start search 
                // from the start of the string. For example: if an oldValue == "EXAMPLE", newValue == "example"
                // and comparisonType == "any ignore case" will conquer to replacing:
                // "EXAMPLE" to "example" to "example" to "example" … infinite loop.
                startSearchFromIndex = foundAt + oldValue.Length;
                if (startSearchFromIndex == str.Length)
                {
                    // It is end of the input string: no more space for the next search.
                    // The input string ends with a value that has already been replaced. 
                    // Therefore, the string builder with the result is complete and no further action is required.
                    return resultStringBuilder.ToString();
                }
            }

            // Append the last part to the result.
            int @charsUntilStringEnd = str.Length - startSearchFromIndex;
            resultStringBuilder.Append(str, startSearchFromIndex, @charsUntilStringEnd);

            return resultStringBuilder.ToString();
        }

        /// <summary>
        /// Poor Man's handling of certain Unicode ligatures and diacritics that have multi-letter replacements,
        /// e.g. German vowels with umlauts, etc.
        /// Not 100% fool-proof ... it does not seem to be the case that all such characters have one unambiguous replacement!
        /// Seems to depend on the particular word and the target locale (language and culture):
        /// https://en.wikipedia.org/wiki/List_of_words_that_may_be_spelled_with_a_ligature
        /// 
        /// This was originally built up from:
        /// https://stackoverflow.com/questions/1271567/how-do-i-replace-accents-german-in-net
        /// (which was designed for German, so hopefully it'll should be AWESOME for Saddleback Berlin!)
        /// I'm sure all of my wonderful Unicode normalization stuff is going to FAIL MISERABLY for Chinese
        /// if used at Saddleback Hong Kong...
        /// 
        /// So ... standard disclaimer on the lack of an express or implied warrant of merchantability for any...
        /// yadda yadda yadda ... you get the idea! Caveat emptor! =)
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        public static string ReplaceKnownUnicodeLigatures(this string input)
        {
            ArgumentNullException.ThrowIfNull(input);

            return input.Aggregate(
              new StringBuilder(),
              (sb, c) =>
              {
                  string r;
                  if (_ligatureReplacements.TryGetValue(c, out r))
                      return sb.Append(r);
                  else
                      return sb.Append(c);
              }).ToString();
        }

        // Feel free to add to this as needed.
        // Beware!  These seem to be language and culture (i.e. locale) dependent. 
        // The "correct" replacement can vary, depending on the specific word and context.
        private static Dictionary<char, string> _ligatureReplacements = new Dictionary<char, string>()
        {
            // original list of replacements
            { 'ä', "ae" },
            { 'Æ', "Ae" },
            { 'æ', "ae" },
            { 'ö', "oe" },
            { 'ü', "ue" },
            { 'Ä', "Ae" },
            { 'Ö', "Oe" },
            { 'Ü', "Ue" },
            { 'ß', "ss" },
            // hard-coded replacements to work around normalization issue
            // replacements might or might not be linguistically correct... Geoffrey did best he could...
            { 'À', "A" },
            { 'Á', "A" },
            { 'Â', "A" },
            { 'Ã', "A" },
            { 'Å', "A" },
            { 'Ç', "C" },
            { 'È', "E" },
            { 'É', "E" },
            { 'Ê', "E" },
            { 'Ì', "I" },
            { 'Í', "I" },
            { 'Î', "I" },
            { 'Ï', "I" },
            { 'Ð', "Th" }, // Latin Eth (capital)
            { 'Ñ', "N" },
            { 'Ò', "O" },
            { 'Ó', "O" },
            { 'Ô', "O" },
            { 'Õ', "O" },
            { 'Ø', "O" },
            { 'Ù', "U" },
            { 'Ú', "U" },
            { 'Û', "U" },
            { 'Ý', "Y" },
            { 'Þ', "Th" }, // Latin Thorn (capital)
            { 'à', "a" },
            { 'á', "a" },
            { 'â', "a" },
            { 'ã', "a" },
            { 'å', "a" },
            { 'ç', "c" },
            { 'è', "e" },
            { 'é', "e" },
            { 'ê', "e" },
            { 'ë', "e" },
            { 'ì', "i" },
            { 'í', "i" },
            { 'î', "i" },
            { 'ï', "i" },
            { 'ð', "th" }, // Latin Eth (lowercase)
            { 'ñ', "n" },
            { 'ò', "o" },
            { 'ó', "o" },
            { 'ô', "o" },
            { 'õ', "o" },
            { 'ø', "o" },
            { 'ù', "u" },
            { 'ú', "u" },
            { 'û', "u" },
            { 'ý', "y" },
            { 'þ', "th" }, // Latin Thorn (lowercase)
            { 'ÿ', "y" },
        };

        /// <summary>
        /// Converts a string into a URL "slug" or other programmatically valid identifier
        /// e.g.
        ///     Dash Software Solutions, Inc. => dash-software-solutions-inc
        /// </summary>
        /// <param name="input"></param>
        /// <param name="delimiter"></param>
        /// <returns></returns>
        public static string Slugify(
            this string input,
            bool forceLowercase = true,
            string delimiter = "-")
        {
            ArgumentNullException.ThrowIfNull(input);

            var escapedDelimiter = Regex.Escape(delimiter);

            var s = input.RemoveDiacritics();

            if (forceLowercase)
                s = s.ToLower();

            // replace ampersands with "and"
            s = s.Replace("&", " and ");

            // replace forward slash with delimiter
            s = s.Replace("/", delimiter);

            // strip invalid chars
            var pattern = $"[^A-Za-z0-9\\s{escapedDelimiter}]";
            s = Regex.Replace(s, pattern, string.Empty);

            // reduce multiple spaces into one space
            s = MultipleSpacesRegex().Replace(s, " ").Trim();

            // replace multiple delimiters with a space
            s = Regex.Replace(s, $"{escapedDelimiter}+", " ").Trim();

            // replace any remaining whitespace with delimiters
            s = MultipleSpacesRegex().Replace(s, delimiter);

            return s;
        }

        [GeneratedRegex(@"[\s]+")]
        private static partial Regex MultipleSpacesRegex();

        public static DateTime? TryParseAsDateTime(this string? viewModelDateTime, bool isUtc = false)
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
