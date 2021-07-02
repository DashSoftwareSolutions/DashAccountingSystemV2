using Xunit;
using DashAccountingSystemV2.Repositories;

namespace DashAccountingSystemV2.Tests.Repositories
{
    public class SharedLookupRepositoryFixture
    {
        [Fact]
        [Trait("Category", "Requires Database")]
        public void GetAccountTypes_Ok()
        {
            var repository = GetSharedLookupRepository();
            var accountTypes = repository.GetAccountTypesAsync().Result;
            Assert.NotEmpty(accountTypes);
            Assert.Contains(accountTypes, at => at.Name == "Asset");
            Assert.Contains(accountTypes, at => at.Name == "Liability");
            Assert.Contains(accountTypes, at => at.Name == "Equity");
            Assert.Contains(accountTypes, at => at.Name == "Revenue");
            Assert.Contains(accountTypes, at => at.Name == "Expense");
        }

        [Fact]
        [Trait("Category", "Requires Database")]
        public void GetAccountSubTypes_Ok()
        {
            var repository = GetSharedLookupRepository();
            var accountSubTypes = repository.GetAccountSubTypesAsync().Result;
            Assert.NotEmpty(accountSubTypes);
            // TODO: Assert all the things!
        }

        [Fact]
        [Trait("Category", "Requires Database")]
        public void GetAssetTypes_Ok()
        {
            var repository = GetSharedLookupRepository();
            var assetTypes = repository.GetAssetTypesAsync().Result;
            Assert.NotEmpty(assetTypes);
            Assert.Contains(assetTypes, at => at.Name == "USD");
            Assert.Contains(assetTypes, at => at.Name == "GBP");
            Assert.Contains(assetTypes, at => at.Name == "EUR");
            Assert.Contains(assetTypes, at => at.Name == "JPY");
        }

        private ISharedLookupRepository GetSharedLookupRepository()
        {
            var appDbContext = TestUtilities.GetDatabaseContextAsync().Result;
            return new SharedLookupRepository(appDbContext);
        }
    }
}
