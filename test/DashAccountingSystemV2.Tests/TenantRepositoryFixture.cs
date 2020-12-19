using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dapper;
using Npgsql;
using Xunit;
using DashAccountingSystemV2.Models;
using DashAccountingSystemV2.Repositories;

namespace DashAccountingSystemV2.Tests
{
    public class TenantRepositoryFixture
    {
        private Guid _tenantId;
        private string _tenantName;

        [Fact]
        [Trait("Category", "Requires Database")]
        public void GetTenant_Ok()
        {
            TestUtilities.RunTestAsync(InitializeTenant, Cleanup, async () =>
            {
                var repository = await GetTenantRepository();
                var retrievedTenant = await repository.GetTenantAsync(_tenantId);
                Assert.NotNull(retrievedTenant);
                Assert.Equal(_tenantId, retrievedTenant.Id);
                Assert.Equal(_tenantName, retrievedTenant.Name);
            });
        }

        private async Task<ITenantRepository> GetTenantRepository()
        {
            var appDbContext = await TestUtilities.GetDatabaseContextAsync();
            return new TenantRepository(appDbContext);
        }

        private void InitializeTenant()
        {
            var connString = TestUtilities.GetConnectionString();
            _tenantName = $"Unit Testing {Guid.NewGuid()}, Inc.";

            using (var connection = new NpgsqlConnection(connString))
            {
                _tenantId = connection.QueryFirstOrDefault<Guid>($@"
                    INSERT INTO ""Tenant"" ( ""Name"" )
                    VALUES ( '{_tenantName}' )
                    RETURNING ""Id"";");
            }
        }

        private void Cleanup()
        {
            var connString = TestUtilities.GetConnectionString();

            using (var connection = new NpgsqlConnection(connString))
            {
                var parameters = new { _tenantId };

                connection.Execute(@"
                    DELETE FROM ""Tenant"" WHERE ""Id"" = @_tenantId;",
                    parameters);
            }
        }
    }
}
