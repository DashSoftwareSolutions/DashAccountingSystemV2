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
    public class AccountRepositoryFixture
    {
        private Guid _tenantId;
        private Guid _userId;

        [Fact]
        [Trait("Category", "Requires Database")]
        public void CreateAccount_Ok()
        {
            TestUtilities.RunTestAsync(Initialize, Cleanup, async () =>
            {
                var accountRepository = await GetAccountRepository();
                var sharedLookupRepository = await GetSharedLookupRepository();

                var accountTypes = await sharedLookupRepository.GetAccountTypesAsync();
                var accountTypeAsset = accountTypes.Single(at => at.Name == "Asset");

                var assetTypes = await sharedLookupRepository.GetAssetTypesAsync();
                var assetTypeUSD = assetTypes.Single(at => at.Name == "USD $");


                var account = new Account(
                    _tenantId,
                    1010,
                    "Operating Cash Account",
                    "Primary business checking account.",
                    accountTypeAsset.Id,
                    assetTypeUSD.Id,
                    AmountType.Debit,
                    _userId);

                var savedAccount = await accountRepository.CreateAccountAsync(account);

                Assert.NotNull(savedAccount);
                Assert.True(savedAccount.Id != Guid.Empty);
            });
        }

        private async Task<IAccountRepository> GetAccountRepository()
        {
            var appDbContext = await TestUtilities.GetDatabaseContextAsync();
            return new AccountRepository(appDbContext);
        }

        private async Task<ISharedLookupRepository> GetSharedLookupRepository()
        {
            var appDbContext = await TestUtilities.GetDatabaseContextAsync();
            return new SharedLookupRepository(appDbContext);
        }

        private void Initialize()
        {
            var connString = TestUtilities.GetConnectionString();

            using (var connection = new NpgsqlConnection(connString))
            {
                // Make a Tenant
                _tenantId = connection.QueryFirstOrDefault<Guid>($@"
                    INSERT INTO ""Tenant"" ( ""Name"" )
                    VALUES ( 'Unit Testing {Guid.NewGuid()}, Inc.' )
                    RETURNING ""Id"";");

                // Get a User to use
                _userId = connection.QueryFirstOrDefault<Guid>(@"
                    SELECT ""Id"" FROM ""AspNetUsers"" ORDER BY ""LastName"", ""FirstName"" LIMIT 1;");
            }
        }

        private void Cleanup()
        {
            var connString = TestUtilities.GetConnectionString();

            using (var connection = new NpgsqlConnection(connString))
            {
                var parameters = new { _tenantId };

                connection.Execute(@"
                    DELETE FROM ""Account"" WHERE ""TenantId"" = @_tenantId;",
                    parameters);

                connection.Execute(@"
                    DELETE FROM ""Tenant"" WHERE ""Id"" = @_tenantId;",
                    parameters);
            }
        }
    }
}
