using DashAccountingSystemV2.BackEnd.Repositories;

namespace DashAccountingSystemV2.Tests.Repositories
{
    public class SharedLookupRepositoryFixture
    {
        [Fact]
        [Trait("Category", "Requires Database")]
        public async Task GetAccountTypes_Ok()
        {
            var repository = GetSharedLookupRepository();
            var accountTypes = await repository.GetAccountTypesAsync();
            Assert.NotEmpty(accountTypes);
            Assert.Contains(accountTypes, at => at.Name == "Asset");
            Assert.Contains(accountTypes, at => at.Name == "Liability");
            Assert.Contains(accountTypes, at => at.Name == "Equity");
            Assert.Contains(accountTypes, at => at.Name == "Revenue");
            Assert.Contains(accountTypes, at => at.Name == "Expense");
        }

        [Fact]
        [Trait("Category", "Requires Database")]
        public async Task GetAccountSubTypes_Ok()
        {
            var repository = GetSharedLookupRepository();
            var accountSubTypes = await repository.GetAccountSubTypesAsync();
            Assert.NotEmpty(accountSubTypes);
            // TODO: Assert all the things!
        }

        [Fact]
        [Trait("Category", "Requires Database")]
        public async Task GetAssetTypes_Ok()
        {
            var repository = GetSharedLookupRepository();
            var assetTypes = await repository.GetAssetTypesAsync();
            Assert.NotEmpty(assetTypes);
            Assert.Contains(assetTypes, at => at.Name == "USD");
            Assert.Contains(assetTypes, at => at.Name == "GBP");
            Assert.Contains(assetTypes, at => at.Name == "EUR");
            Assert.Contains(assetTypes, at => at.Name == "JPY");
        }

        [Fact]
        [Trait("Category", "Requires Database")]
        public async Task GetCountries_Ok()
        {
            var repository = GetSharedLookupRepository();
            var countries = await repository.GetCountriesAsync();
            Assert.NotEmpty(countries);
            Assert.Contains(countries, c => c.ThreeLetterCode == "USA");
            Assert.Contains(countries, c => c.ThreeLetterCode == "CAN");
            Assert.Contains(countries, c => c.ThreeLetterCode == "MEX");
            Assert.Contains(countries, c => c.ThreeLetterCode == "PAN");
            Assert.Contains(countries, c => c.ThreeLetterCode == "HTI");
            Assert.Contains(countries, c => c.ThreeLetterCode == "JAM");
            Assert.Contains(countries, c => c.ThreeLetterCode == "PER");
            // ... ♫ ;-)
        }

        [Fact]
        [Trait("Category", "Requires Database")]
        public async Task GetPaymentMethods_Ok()
        {
            var repository = GetSharedLookupRepository();
            var paymentMethods = await repository.GetPaymentMethodsAsync();
            Assert.NotEmpty(paymentMethods);
            Assert.Contains(paymentMethods, pm => pm.Name == "Cash");
            Assert.Contains(paymentMethods, pm => pm.Name == "Check");
            Assert.Contains(paymentMethods, pm => pm.Name == "Credit Card");
            Assert.Contains(paymentMethods, pm => pm.Name == "Direct Deposit");
        }

        [Fact]
        [Trait("Category", "Requires Database")]
        public async Task GetRegionsByCountryId_Ok()
        {
            var repository = GetSharedLookupRepository();
            var countries = await repository.GetCountriesAsync();
            var usa = countries.Single(c => c.TwoLetterCode == "US");
            var regions = await repository.GetRegionsByCountryAsync(usa.Id);
            Assert.NotEmpty(regions);
            Assert.Contains(regions, r => r.Name == "Alabama");
            Assert.Contains(regions, r => r.Name == "Alaska");
            Assert.Contains(regions, r => r.Name == "Arizona");
            Assert.Contains(regions, r => r.Name == "Arkansas");
            Assert.Contains(regions, r => r.Name == "California");
            // ...

            var canada = countries.FirstOrDefault(c => c.TwoLetterCode == "CA");
            regions = await repository.GetRegionsByCountryAsync(canada.Id);
            Assert.NotEmpty(regions);
            Assert.Contains(regions, r => r.Name == "Alberta");
            Assert.Contains(regions, r => r.Name == "Ontario");
            Assert.Contains(regions, r => r.Name == "British Columbia");
            // ...
        }

        [Fact]
        [Trait("Category", "Requires Database")]
        public async Task GetRegionsByCountryAlpha2Code_Ok()
        {
            var repository = GetSharedLookupRepository();
            var regions = await repository.GetRegionsByCountryAlpha2CodeAsync("US");
            Assert.NotEmpty(regions);
            Assert.Contains(regions, r => r.Name == "Alabama");
            Assert.Contains(regions, r => r.Name == "Alaska");
            Assert.Contains(regions, r => r.Name == "Arizona");
            Assert.Contains(regions, r => r.Name == "Arkansas");
            Assert.Contains(regions, r => r.Name == "California");
            // ...

            regions = await repository.GetRegionsByCountryAlpha2CodeAsync("MX"); // Mexico
            Assert.NotEmpty(regions);
            Assert.Contains(regions, r => r.Name == "Jalisco");
            Assert.Contains(regions, r => r.Name == "Nayarit");
            Assert.Contains(regions, r => r.Name == "Hidalgo");
            Assert.Contains(regions, r => r.Name == "Baja California");
            // ...
        }

        [Fact]
        [Trait("Category", "Requires Database")]
        public async Task GetRegionsByCountryAlpha3Code_Ok()
        {
            var repository = GetSharedLookupRepository();
            var regions = await repository.GetRegionsByCountryAlpha3CodeAsync("USA");
            Assert.NotEmpty(regions);
            Assert.Contains(regions, r => r.Name == "Alabama");
            Assert.Contains(regions, r => r.Name == "Alaska");
            Assert.Contains(regions, r => r.Name == "Arizona");
            Assert.Contains(regions, r => r.Name == "Arkansas");
            Assert.Contains(regions, r => r.Name == "California");
            // ...

            regions = await repository.GetRegionsByCountryAlpha3CodeAsync("NIC"); // Nicaragua
            Assert.NotEmpty(regions);
            Assert.Contains(regions, r => r.Name == "Managua");
            Assert.Contains(regions, r => r.Name == "Masaya");
            Assert.Contains(regions, r => r.Name == "Granada");
            Assert.Contains(regions, r => r.Name == "Matagalpa");
            // ...
        }

        private ISharedLookupRepository GetSharedLookupRepository()
        {
            var appDbContext = TestUtilities.GetDatabaseContextAsync().Result;
            return new SharedLookupRepository(appDbContext);
        }
    }
}
