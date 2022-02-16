using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Dapper;
using Npgsql;
using Xunit;
using DashAccountingSystemV2.Models;
using DashAccountingSystemV2.Repositories;

namespace DashAccountingSystemV2.Tests.Repositories
{
    public class ProductRepositoryFixture
    {
        private Guid _tenantId;
        private Guid _userId;

        [Fact]
        [Trait("Category", "Requires Database")]
        public void ProductRepository_Ok()
        {
            TestUtilities.RunTestAsync(Initialize, Cleanup, async () =>
            {
                var repository = await GetProductRepository();
                
                var fooCategory = new ProductCategory() { TenantId = _tenantId, Name = $"Foo Category {Guid.NewGuid()}", CreatedById = _userId };
                var savedFooCategory = await repository.InsertCategory(fooCategory);
                Assert.NotNull(savedFooCategory);

                var barCategory = new ProductCategory() { TenantId = _tenantId, Name = $"Bar Category {Guid.NewGuid()}", CreatedById = _userId };
                var savedBarCategory = await repository.InsertCategory(barCategory);
                Assert.NotNull(savedBarCategory);

                // Make a Revenue Account
                var sharedLookupRepository = await GetSharedLookupRepository();

                var accountTypes = await sharedLookupRepository.GetAccountTypesAsync();
                var accountTypeRevenue = accountTypes.Single(at => at.Name == "Revenue");

                var accountSubTypes = await sharedLookupRepository.GetAccountSubTypesAsync();
                var accountSubTypeOperatingRevenue = accountSubTypes.Single(ast => ast.Name == "Operating Revenue");

                var assetTypes = await sharedLookupRepository.GetAssetTypesAsync();
                var assetTypeUSD = assetTypes.Single(at => at.Name == "USD");

                var revenueAccount = await MakeAccount(
                    4010, "Revenue from Sale of Widgets", accountTypeRevenue, accountSubTypeOperatingRevenue, assetTypeUSD, AmountType.Credit);

                var widgetsGUID = Guid.NewGuid();
                var widgetProduct = new Product()
                {
                    TenantId = _tenantId,
                    Type = ProductType.Product,
                    Name = $"Widgets {widgetsGUID}",
                    SKU = $"12345-{widgetsGUID}",
                    Description = "Widgets are awesome!",
                    CategoryId = savedFooCategory.Id,
                    SalesPriceOrRate = 123.45m,
                    RevenueAccountId = revenueAccount.Id,
                    CreatedById = _userId
                };

                var savedWidgetProduct = await repository.InsertProduct(widgetProduct);
                Assert.NotNull(savedWidgetProduct);
            });
        }

        private async Task<IAccountRepository> GetAccountRepository()
        {
            var appDbContext = await TestUtilities.GetDatabaseContextAsync();
            return new AccountRepository(appDbContext);
        }

        private async Task<IProductRepository> GetProductRepository()
        {
            var appDbContext = await TestUtilities.GetDatabaseContextAsync();
            return new ProductRepository(appDbContext);
        }

        private async Task<ISharedLookupRepository> GetSharedLookupRepository()
        {
            var appDbContext = await TestUtilities.GetDatabaseContextAsync();
            return new SharedLookupRepository(appDbContext);
        }

        private async Task<Account> MakeAccount(
            ushort accountNumber,
            string name,
            AccountType accountType,
            AccountSubType accountSubType,
            AssetType assetType,
            AmountType balanceType)
        {
            var account = new Account(
                _tenantId,
                accountNumber,
                name,
                null,
                accountType.Id,
                accountSubType.Id,
                assetType.Id,
                balanceType,
                _userId);

            var accountRepository = await GetAccountRepository();
            var savedAccount = await accountRepository.CreateAccountAsync(account);

            Assert.NotNull(savedAccount);
            Assert.True(savedAccount.Id != Guid.Empty);

            return savedAccount;
        }

        private async Task Initialize()
        {
            var connString = TestUtilities.GetConnectionString();

            using (var connection = new NpgsqlConnection(connString))
            {
                // Make a Tenant
                _tenantId = await connection.QueryFirstOrDefaultAsync<Guid>($@"
                    INSERT INTO ""Tenant"" ( ""Name"" )
                    VALUES ( 'Unit Testing {Guid.NewGuid()}, Inc.' )
                    RETURNING ""Id"";");

                // Get a User to use
                _userId = await connection.QueryFirstOrDefaultAsync<Guid>(@"
                    SELECT ""Id"" FROM ""AspNetUsers"" ORDER BY ""LastName"", ""FirstName"" LIMIT 1;");
            }
        }

        private async Task Cleanup()
        {
            var connString = TestUtilities.GetConnectionString();

            using (var connection = new NpgsqlConnection(connString))
            {
                var parameters = new { _tenantId };

                await connection.ExecuteAsync(@"
                    DELETE FROM ""Product"" WHERE ""TenantId"" = @_tenantId;",
                    parameters);

                await connection.ExecuteAsync(@"
                    DELETE FROM ""ProductCategory"" WHERE ""TenantId"" = @_tenantId;",
                    parameters);

                await connection.ExecuteAsync(@"
                    DELETE FROM ""Account"" WHERE ""TenantId"" = @_tenantId;",
                    parameters);

                await connection.ExecuteAsync(@"
                    DELETE FROM ""Tenant"" WHERE ""Id"" = @_tenantId;",
                    parameters);
            }
        }
    }
}
