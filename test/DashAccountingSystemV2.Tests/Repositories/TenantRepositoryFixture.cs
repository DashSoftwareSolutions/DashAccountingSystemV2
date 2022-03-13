using System;
using System.Threading.Tasks;
using Dapper;
using Npgsql;
using Xunit;
using DashAccountingSystemV2.Models;
using DashAccountingSystemV2.Repositories;

namespace DashAccountingSystemV2.Tests.Repositories
{
    public class TenantRepositoryFixture
    {
        private Guid _tenantId;
        private string _tenantName;

        [Fact]
        [Trait("Category", "Requires Database")]
        public void GetTenant_Ok()
        {
            TestUtilities.RunTestAsync(Initialize, Cleanup, async () =>
            {
                var repository = await GetTenantRepository();
                var retrievedTenant = await repository.GetTenantAsync(_tenantId);
                Assert.NotNull(retrievedTenant);
                Assert.Equal(_tenantId, retrievedTenant.Id);
                Assert.Equal(_tenantName, retrievedTenant.Name);
            });
        }

        [Fact]
        [Trait("Category", "Requires Database")]
        public void GetTenantByName_Ok()
        {
            TestUtilities.RunTestAsync(Initialize, Cleanup, async () =>
            {
                var repository = await GetTenantRepository();
                var retrievedTenant = await repository.GetTenantByNameAsync(_tenantName);
                Assert.NotNull(retrievedTenant);
                Assert.Equal(_tenantId, retrievedTenant.Id);
                Assert.Equal(_tenantName, retrievedTenant.Name);
            });
        }

        [Fact]
        [Trait("Category", "Requires Database")]
        public void GetTenantDetailed_Ok()
        {
            TestUtilities.RunTestAsync(Initialize, Cleanup, async () =>
            {
                var repository = await GetTenantRepository();
                
                var retrievedTenant = await repository.GetTenantDetailedAsync(_tenantId);
                Assert.NotNull(retrievedTenant);
                Assert.Equal(_tenantId, retrievedTenant.Id);
                Assert.Equal(_tenantName, retrievedTenant.Name);
                Assert.NotNull(retrievedTenant.MailingAddress);
                Assert.NotNull(retrievedTenant.MailingAddress.Tenant);
                Assert.NotNull(retrievedTenant.MailingAddress.Entity);
                Assert.NotNull(retrievedTenant.MailingAddress.Region);
                Assert.NotNull(retrievedTenant.MailingAddress.Country);

                retrievedTenant = await repository.GetTenantDetailedByNameAsync(_tenantName);
                Assert.NotNull(retrievedTenant);
                Assert.Equal(_tenantId, retrievedTenant.Id);
                Assert.Equal(_tenantName, retrievedTenant.Name);
                Assert.NotNull(retrievedTenant.MailingAddress);
                Assert.NotNull(retrievedTenant.MailingAddress.Tenant);
                Assert.NotNull(retrievedTenant.MailingAddress.Entity);
                Assert.NotNull(retrievedTenant.MailingAddress.Region);
                Assert.NotNull(retrievedTenant.MailingAddress.Country);
            });
        }

        [Fact]
        [Trait("Category", "Requires Database")]
        public void GetTenants_Ok()
        {
            TestUtilities.RunTestAsync(Initialize, Cleanup, async () =>
            {
                var repository = await GetTenantRepository();
                var retrievedTenants = await repository.GetTenantsAsync();
                Assert.NotNull(retrievedTenants);
                Assert.NotEmpty(retrievedTenants);

                var retrievedTenant = Assert.Single(retrievedTenants, t => t.Id == _tenantId);
                Assert.Equal(_tenantId, retrievedTenant.Id);
                Assert.Equal(_tenantName, retrievedTenant.Name);
            });
        }

        private async Task<ITenantRepository> GetTenantRepository()
        {
            var appDbContext = await TestUtilities.GetDatabaseContextAsync();
            return new TenantRepository(appDbContext);
        }

        private async Task Initialize()
        {
            var connString = TestUtilities.GetConnectionString();
            _tenantName = $"Unit Testing {Guid.NewGuid()}, Inc.";

            using (var connection = new NpgsqlConnection(connString))
            {
                var assetTypeUSD = await connection.QueryFirstOrDefaultAsync<int>(
                    @"SELECT ""Id"" FROM ""AssetType"" WHERE ""Name"" = 'USD';");

                var userId = await connection.QueryFirstOrDefaultAsync<Guid>(
                    @"SELECT ""Id"" FROM ""AspNetUsers"" ORDER BY ""LastName"", ""FirstName"" LIMIT 1;");

                _tenantId = await connection.QueryFirstOrDefaultAsync<Guid>(
@"INSERT INTO ""Tenant"" ( ""Name"", ""DefaultAssetTypeId"", ""ContactEmailAddress"" )
VALUES ( @_tenantName, @assetTypeUSD, 'someone@example.com' )
RETURNING ""Id"";",
                    new { _tenantName, assetTypeUSD });

                var tenantEntityId = await connection.QueryFirstOrDefaultAsync<Guid>(
@"INSERT INTO ""Entity"" ( ""TenantId"", ""EntityType"", ""CreatedById"" )
VALUES ( @_tenantId, @entityType, @userId )
RETURNING ""Id"";",
                    new { _tenantId, userId, entityType = (int)EntityType.Tenant });

                var countryUSA = await connection.QueryFirstOrDefaultAsync<int>(
                    @"SELECT ""Id"" FROM ""Country"" WHERE ""ThreeLetterCode"" = 'USA' LIMIT 1;");

                var regionCalifornia = await connection.QueryFirstOrDefaultAsync<int>(
                    @"SELECT ""Id"" FROM ""Region"" WHERE ""CountryId"" = @countryUSA AND ""Code"" = 'CA' LIMIT 1;",
                    new { countryUSA });

                await connection.ExecuteAsync(@"
INSERT INTO ""Address""
(
      ""TenantId""
    , ""EntityId""
    , ""AddressType""
    , ""StreetAddress1""
    , ""City""
    , ""RegionId""
    , ""CountryId""
    , ""PostalCode""
    , ""CreatedById""
)
VALUES
(
     @_tenantId
    ,@tenantEntityId
    ,@addressType
    ,'123 Some Street'
    ,'Santa Ana'
    ,@regionCalifornia
    ,@countryUSA
    ,'92701'
    ,@userId
);
",
                    new
                    {
                        addressType = (int)AddressType.Home,
                        countryUSA,
                        regionCalifornia,
                        tenantEntityId,
                        _tenantId,
                        userId
                    });
            }
        }

        private async Task Cleanup()
        {
            var connString = TestUtilities.GetConnectionString();

            using (var connection = new NpgsqlConnection(connString))
            {
                var parameters = new { _tenantId };

                await connection.ExecuteAsync(
                    @"DELETE FROM ""Address"" WHERE ""TenantId"" = @_tenantId;",
                    parameters);

                await connection.ExecuteAsync(
                    @"DELETE FROM ""Entity"" WHERE ""TenantId"" = @_tenantId;",
                    parameters);

                await connection.ExecuteAsync(
                    @"DELETE FROM ""Tenant"" WHERE ""Id"" = @_tenantId;",
                    parameters);
            }
        }
    }
}
