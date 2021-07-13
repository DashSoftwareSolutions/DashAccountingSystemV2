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
    public class CustomerRepositoryFixture
    {
        private Guid _tenantId;
        private Guid _userId;

        [Fact]
        [Trait("Category", "Requires Database")]
        public void CreateCustomer_Ok()
        {
            TestUtilities.RunTestAsync(Initialize, Cleanup, async () =>
            {
                var sharedLookupsRepository = await GetSharedLookupRepository();

                var australia = (await sharedLookupsRepository.GetCountriesAsync())
                    .FirstOrDefault(c => c.ThreeLetterCode == "AUS");

                var newSouthWales = (await sharedLookupsRepository.GetRegionsByCountryAlpha3CodeAsync("AUS"))
                    .FirstOrDefault(r => r.Code == "NSW");

                var peacekeeperCommand = new Customer()
                {
                    Entity = new Entity()
                    {
                        TenantId = _tenantId,
                        EntityType = EntityType.Organization | EntityType.Customer,
                        CreatedById = _userId,
                    },
                    TenantId = _tenantId,
                    CompanyName = "Peacekeeper Command",
                    CustomerNumber = "PEACE123",
                    DisplayName = "Peackeeper Command HQ",
                    ContactPersonTitle = "Commandant",
                    ContactPersonFirstName = "Mele-On",
                    ContactPersonLastName = "Grayza",
                    BillingAddress = new Address()
                    {
                        TenantId = _tenantId,
                        AddressType = AddressType.Billing,
                        StreetAddress1 = "28 Union St",
                        City = "North Sydny",
                        RegionId = newSouthWales.Id,
                        CountryId = australia.Id,
                        PostalCode = "2060",
                    },
                    WorkPhoneNumber = "+61299295403",
                    Email = "commandant.grayza@peacekeepercommand.mil.example.com",
                    Website = "https://peacekeepercommand.mil.example.com",
                    Notes = "Don't invite the Scarrans!"
                };

                var customerRepository = await GetCustomerRepository();
                var savedCustomer = await customerRepository.InsertAsync(peacekeeperCommand);
                Assert.NotNull(savedCustomer);
                // TODO: Assert all the things!
            });
        }

        private async Task<ICustomerRepository> GetCustomerRepository()
        {
            var appDbContext = await TestUtilities.GetDatabaseContextAsync();
            return new CustomerRepository(appDbContext);
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
                    DELETE FROM ""Customer"" WHERE ""TenantId"" = @_tenantId;",
                    parameters);

                connection.Execute(@"
                    DELETE FROM ""Address"" WHERE ""TenantId"" = @_tenantId;",
                    parameters);

                connection.Execute(@"
                    DELETE FROM ""Entity"" WHERE ""TenantId"" = @_tenantId;",
                    parameters);

                connection.Execute(@"
                    DELETE FROM ""Tenant"" WHERE ""Id"" = @_tenantId;",
                    parameters);
            }
        }
    }
}
