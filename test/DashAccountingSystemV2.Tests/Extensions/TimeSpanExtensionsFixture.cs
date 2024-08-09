using DashAccountingSystemV2.BackEnd.Extensions;

namespace DashAccountingSystemV2.Tests.Extensions
{
    public class TimeSpanExtensionsFixture
    {
        [Fact]
        public void HumanizeHoursAndMinutes_Ok()
        {
            var input = TimeSpan.FromMinutes(1);
            Assert.Equal("1 min", input.HumanizeHoursAndMinutes());
            Assert.Equal("1 minute", input.HumanizeHoursAndMinutes(abbreviateUnits: false));

            input = TimeSpan.FromMinutes(15);
            Assert.Equal("15 mins", input.HumanizeHoursAndMinutes());
            Assert.Equal("15 minutes", input.HumanizeHoursAndMinutes(abbreviateUnits: false));

            input = TimeSpan.FromMinutes(59);
            Assert.Equal("59 mins", input.HumanizeHoursAndMinutes());
            Assert.Equal("59 minutes", input.HumanizeHoursAndMinutes(abbreviateUnits: false));

            input = TimeSpan.FromMinutes(60);
            Assert.Equal("1 hr", input.HumanizeHoursAndMinutes());
            Assert.Equal("1 hour", input.HumanizeHoursAndMinutes(abbreviateUnits: false));

            input = TimeSpan.FromHours(1);
            Assert.Equal("1 hr", input.HumanizeHoursAndMinutes());
            Assert.Equal("1 hour", input.HumanizeHoursAndMinutes(abbreviateUnits: false));

            input = TimeSpan.FromMinutes(61);
            Assert.Equal("1 hr 1 min", input.HumanizeHoursAndMinutes());
            Assert.Equal("1 hour 1 minute", input.HumanizeHoursAndMinutes(abbreviateUnits: false));

            input = TimeSpan.FromMinutes(150);
            Assert.Equal("2 hrs 30 mins", input.HumanizeHoursAndMinutes());
            Assert.Equal("2 hours 30 minutes", input.HumanizeHoursAndMinutes(abbreviateUnits: false));
        }
    }
}
