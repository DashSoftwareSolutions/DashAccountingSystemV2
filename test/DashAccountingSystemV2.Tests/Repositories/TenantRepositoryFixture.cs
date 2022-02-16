using System;
using System.Threading.Tasks;
using Dapper;
using Npgsql;
using Xunit;
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
                _tenantId = await connection.QueryFirstOrDefaultAsync<Guid>($@"
                    INSERT INTO ""Tenant"" ( ""Name"" )
                    VALUES ( '{_tenantName}' )
                    RETURNING ""Id"";");
            }
        }

        private async Task Cleanup()
        {
            var connString = TestUtilities.GetConnectionString();

            using (var connection = new NpgsqlConnection(connString))
            {
                var parameters = new { _tenantId };

                await connection.ExecuteAsync(@"
                    DELETE FROM ""Tenant"" WHERE ""Id"" = @_tenantId;",
                    parameters);
            }
        }
    }
}
