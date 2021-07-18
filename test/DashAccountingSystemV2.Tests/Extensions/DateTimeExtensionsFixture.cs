using System;
using Xunit;
using DashAccountingSystemV2.Extensions;
using NodaTime;

namespace DashAccountingSystemV2.Tests.Extensions
{
    public class DateTimeExtensionsFixture
    {
        [Theory]
        [InlineData(8, 0, 0, false, "+08:00")]
        [InlineData(7, 30, 0, false, "+07:30")]
        [InlineData(8, 0, 0, true, "-08:00")]
        [InlineData(6, 45, 0, true, "-06:45")]
        public void DateTimeExtensions_TimeSpan_ToHMString_IsOk(
            int inputHours,
            int inputMinutes,
            int inputSeconds,
            bool isNegative,
            string expectedResult)
        {
            var timeSpan = new TimeSpan(inputHours, inputMinutes, inputSeconds);

            if (isNegative)
                timeSpan = timeSpan.Negate();

            var actualResult = timeSpan.ToHMString();
            Assert.Equal(expectedResult, actualResult);
        }

        [Theory]
        [InlineData("America/Los_Angeles", "-07:00")]
        [InlineData("Asia/Kolkata", "+06:30")]
        [InlineData("America/Montevideo", "-01:30")]
        public void DateTimeExtensions_TimeSpan_ToHMString_CanDisplayMaxTimeZoneOffsets(string timeZoneName, string expectedMaxOffset)
        {
            var timeSpan = DateTimeZoneProviders.Tzdb[timeZoneName].MaxOffset.ToTimeSpan();
            Assert.Equal(expectedMaxOffset, timeSpan.ToHMString());
        }

        [Theory]
        [InlineData("America/Los_Angeles", "-08:00")]
        public void DateTimeExtensions_TimeSpan_ToHMString_CanDisplayMinTimeZoneOffsets(string timeZoneName, string expectedMinOffset)
        {
            var timeSpan = DateTimeZoneProviders.Tzdb[timeZoneName].MinOffset.ToTimeSpan();
            Assert.Equal(expectedMinOffset, timeSpan.ToHMString());
        }
    }
}
