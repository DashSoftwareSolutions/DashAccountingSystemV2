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

        [Fact]
        [Trait("Category", "Requires Database")]
        public void GetByTenantIdAsync_Ok()
        {
            TestUtilities.RunTestAsync(Initialize, Cleanup, async () =>
            {
                await InitializeManyCustomers();

                var repository = await GetCustomerRepository();

                var results1 = await repository.GetByTenantIdAsync(_tenantId);
                Assert.Equal(3, results1.Count());

                var results2 = await repository.GetByTenantIdAsync(_tenantId, new string[] { "SVCC", "ELCLH" });
                Assert.Equal(2, results2.Count());
                Assert.Contains(results2, c => c.CustomerNumber == "SVCC");
                Assert.Contains(results2, c => c.CustomerNumber == "ELCLH");

                // TODO: Test and Assert that filtering by Active ones works
            });
        }

        private async Task InitializeManyCustomers()
        {
            var repository = await GetCustomerRepository();
            var sharedLookupsRepository = await GetSharedLookupRepository();

            var unitedStates = (await sharedLookupsRepository.GetCountriesAsync())
                .FirstOrDefault(c => c.ThreeLetterCode == "USA");

            var california = (await sharedLookupsRepository.GetRegionsByCountryAlpha3CodeAsync("USA"))
                .FirstOrDefault(r => r.Code == "CA");

            var customer1 = new Customer()
            {
                Entity = new Entity()
                {
                    TenantId = _tenantId,
                    EntityType = EntityType.Organization | EntityType.Customer,
                    CreatedById = _userId,
                },
                TenantId = _tenantId,
                CompanyName = "Saddleback Valley Community Church",
                CustomerNumber = "SVCC",
                DisplayName = "Saddleback Church",
                ContactPersonTitle = "Mr.",
                ContactPersonFirstName = "Church",
                ContactPersonLastName = "Saddleback",
                BillingAddress = new Address()
                {
                    TenantId = _tenantId,
                    AddressType = AddressType.Billing,
                    StreetAddress1 = "1 Saddleback Parkway",
                    City = "Lake Forest",
                    RegionId = california.Id,
                    CountryId = unitedStates.Id,
                    PostalCode = "92630",
                },
                WorkPhoneNumber = "+19496098000",
                Email = "chuck@saddleback.com",
                Website = "https://saddleback.com",
            };

            var savedCustomer1 = await repository.InsertAsync(customer1);

            var customer2 = new Customer()
            {
                Entity = new Entity()
                {
                    TenantId = _tenantId,
                    EntityType = EntityType.Organization | EntityType.Customer,
                    CreatedById = _userId,
                },
                TenantId = _tenantId,
                CompanyName = "Emanuel Lutheran Church",
                CustomerNumber = "ELCLH",
                DisplayName = "Emanuel Lutheran Church",
                ContactPersonTitle = "Mrs.",
                ContactPersonFirstName = "Jane",
                ContactPersonLastName = "Doe",
                BillingAddress = new Address()
                {
                    TenantId = _tenantId,
                    AddressType = AddressType.Billing,
                    StreetAddress1 = "150 N. Palm Street",
                    City = "La Habra",
                    RegionId = california.Id,
                    CountryId = unitedStates.Id,
                    PostalCode = "90631",
                },
                WorkPhoneNumber = "+15626910656",
                Email = "churchinfo@elclh.org",
                Website = "http://elclh.org/",
            };

            var savedCustomer2 = await repository.InsertAsync(customer2);

            var customer3 = new Customer()
            {
                Entity = new Entity()
                {
                    TenantId = _tenantId,
                    EntityType = EntityType.Organization | EntityType.Customer,
                    CreatedById = _userId,
                },
                TenantId = _tenantId,
                CompanyName = "Chocolate Milk Corporation",
                CustomerNumber = "CMC1234",
                DisplayName = "Chocolate Milk Corporation",
                ContactPersonTitle = "Mr.",
                ContactPersonFirstName = "John",
                ContactPersonLastName = "Smith",
                BillingAddress = new Address()
                {
                    TenantId = _tenantId,
                    AddressType = AddressType.Billing,
                    StreetAddress1 = "5 Chrysler",
                    City = "Irvine",
                    RegionId = california.Id,
                    CountryId = unitedStates.Id,
                    PostalCode = "92618",
                },
                WorkPhoneNumber = "+19495556789",
                Email = "chocolatemilk@example.com",
                Website = "https://chocolate.example.com/",
            };

            var savedCustomer3 = await repository.InsertAsync(customer3);
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
