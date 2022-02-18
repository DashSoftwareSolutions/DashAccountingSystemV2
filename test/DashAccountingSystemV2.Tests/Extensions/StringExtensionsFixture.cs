using System;
using System.Collections.Generic;
using System.Linq;
using Xunit;
using DashAccountingSystemV2.Extensions;

namespace DashAccountingSystemV2.Tests.Extensions
{
    public class StringExtensionsFixture
    {
        [Theory]
        [InlineData(
            "server=postgres;Port=5432;User Id=unit_test_db_user;Password=SuperSecretDatabasePassword;Database=foo_database",
            "server=postgres;Port=5432;User Id=unit_test_db_user;Password=****word;Database=foo_database")]
        [InlineData(
            "Server=SOMESQLSERVER;Database=SOMEDATABASE;Trusted_Connection=True;",
            "Server=SOMESQLSERVER;Database=SOMEDATABASE;Trusted_Connection=True;")]
        public void MaskPasswordOk(string originalInput, string expectedResult)
        {
            var actualResult = originalInput.MaskPassword();
            Assert.Equal(expectedResult, actualResult);
        }

        [Theory]
        [InlineData(null, null)]
        [InlineData("", "")]
        [InlineData("X", "********", -1)]
        [InlineData("X", "********", 0)]
        [InlineData("X", "****X", 1)]
        [InlineData("X", "****X", 2)]
        [InlineData("XY", "********", -1)]
        [InlineData("XY", "********", 0)]
        [InlineData("XY", "****Y", 1)]
        [InlineData("XY", "****XY", 2)]
        [InlineData("XY", "****XY", 3)]
        [InlineData("SuperSecretPassword", "****word")]
        [InlineData("SuperSecretPassword", "****Password", 8)]
        public void MaskSecretValue_Ok(string originalInput, string expectedResult, int? numberOfCharactersToReveal = null)
        {
            var actualResult = numberOfCharactersToReveal.HasValue ?
                originalInput.MaskSecretValue(numberOfCharactersToReveal.Value) :
                originalInput.MaskSecretValue();

            Assert.Equal(expectedResult, actualResult);
        }

        [Fact]
        public void ParseCommaSeparatedIntegers_Ok()
        {
            string input = null;
            var results = input.ParseCommaSeparatedIntegers();
            Assert.Null(results);

            input = "1,3,5,7,9,11, 13, 15,  19";
            results = input.ParseCommaSeparatedIntegers();
            Assert.Equal(9, results.Count());
            var expectedValues = new uint[] { 1, 3, 5, 7, 9, 11, 13, 15, 19 };

            foreach (var expected in expectedValues)
                Assert.Contains(expected, results);
        }

        [Fact]
        public void ParseListOfCommaSeparatedIntegers_Ok()
        {
            // Case 1: Input is NULL
            List<string> input = null;
            var results = input.ParseCommaSeparatedIntegers();
            Assert.Null(results);

            // Case 2: Input is Empty
            input = new List<string>();
            results = input.ParseCommaSeparatedIntegers();
            Assert.Null(results);

            // Case 3: Input does not contain valid integers
            input.Add("Bad");
            input.Add("Not a Number");
            results = input.ParseCommaSeparatedIntegers();
            Assert.Empty(results);

            // Case 4: Some valid integers which we find
            input.Add("42");
            input.Add("777");
            results = input.ParseCommaSeparatedIntegers();
            Assert.Equal(2, results.Count());
            Assert.Contains((uint)42, results);
            Assert.Contains((uint)777, results);
        }

        [Theory]
        [InlineData("Hablas Español?", "Hablas Espanol?")]
        [InlineData("Können Sie mir behilflich sein?", "Koennen Sie mir behilflich sein?")]
        [InlineData("Ich weiß nicht", "Ich weiss nicht")]
        public void RemoveDiactricits_Ok(string originalInput, string expectedResult)
        {
            var actualResult = originalInput.RemoveDiacritics();
            Assert.Equal(expectedResult, actualResult);
        }

        [Theory]
        [InlineData("hello world", "Hello", "Goodbye", StringComparison.Ordinal, "hello world")]
        [InlineData("hello world", "Hello", "Goodbye", StringComparison.OrdinalIgnoreCase, "Goodbye world")]
        public void Replace_WithComparisonType_Ok(
            string originalInput,
            string find,
            string replace,
            StringComparison comparisonType,
            string expectedResult)
        {
            var actualResult = originalInput.Replace(find, replace, comparisonType);
            Assert.Equal(expectedResult, actualResult);
        }

        [Theory]
        [InlineData("Ich weiß nicht", "Ich weiss nicht")]
        [InlineData("Ægyptus", "Aegyptus")]
        [InlineData("æroplane", "aeroplane")]
        public void ReplaceKnownUnicodeLigatures_Ok(string originalInput, string expectedResult)
        {
            var actualResult = originalInput.ReplaceKnownUnicodeLigatures();
            Assert.Equal(expectedResult, actualResult);
        }

        [Theory]
        [InlineData("Dash Software Solutions, Inc.", "Dash_Software_Solutions_Inc", false, "_")]
        [InlineData("Können Sie mir behilflich sein?", "koennen-sie-mir-behilflich-sein")]
        [InlineData("Ich weiß nicht", "ich-weiss-nicht")]
        public void Slugify_Ok(string originalInput, string expectedResult, bool? forceLowerCase = true, string delimiter = null)
        {
            var forceLowercaseSpecified = forceLowerCase.HasValue;
            var delimiterSpecified = delimiter.HasValue();

            string actualResult = null;

            if (forceLowercaseSpecified && delimiterSpecified)
                actualResult = originalInput.Slugify(forceLowerCase.Value, delimiter);
            else if (forceLowercaseSpecified)
                actualResult = originalInput.Slugify(forceLowerCase.Value);
            else if (delimiterSpecified)
                actualResult = originalInput.Slugify(delimiter: delimiter);

            Assert.Equal(expectedResult, actualResult);
        }
    }
}
