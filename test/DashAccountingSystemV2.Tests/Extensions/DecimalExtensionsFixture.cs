using Xunit;
using DashAccountingSystemV2.Extensions;
using DashAccountingSystemV2.Models;

namespace DashAccountingSystemV2.Tests.Extensions
{
    public class DecimalExtensionsFixture
    {
        [Theory]
        [InlineData(1000, AmountType.Debit, 1000)]
        [InlineData(-1000, AmountType.Debit, -1000)]
        [InlineData(-2500.25, AmountType.Credit, 2500.25)]
        [InlineData(2500.25, AmountType.Credit, -2500.25)]
        public void WithNormalBalanceType_Ok(decimal originalAmount, AmountType normalBalanceType, decimal expectedAmount)
        {
            Assert.Equal(expectedAmount, originalAmount.WithNormalBalanceType(normalBalanceType));
        }
    }
}
