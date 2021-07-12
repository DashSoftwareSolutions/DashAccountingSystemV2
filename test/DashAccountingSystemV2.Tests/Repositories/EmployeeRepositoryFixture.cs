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
    public class EmployeeRepositoryFixture
    {
        private Guid _tenantId;
        private Guid _userId;

        [Fact]
        [Trait("Category", "Requires Database")]
        public void CreateEmployee_Ok()
        {
            TestUtilities.RunTestAsync(Initialize, Cleanup, async () =>
            {
                var sharedLookupsRepository = await GetSharedLookupRepository();
                
                var australia = (await sharedLookupsRepository.GetCountriesAsync())
                    .FirstOrDefault(c => c.ThreeLetterCode == "AUS");

                var newSouthWales = (await sharedLookupsRepository.GetRegionsByCountryAlpha3CodeAsync("AUS"))
                    .FirstOrDefault(r => r.Code == "NSW");

                var aerynSun = new Employee()
                {
                    Entity = new Entity()
                    {
                        TenantId = _tenantId,
                        EntityType = EntityType.Person | EntityType.Employee,
                        CreatedById = _userId,
                    },
                    TenantId = _tenantId,
                    FirstName = "Aeryn",
                    LastName = "Sun",
                    DisplayName = "Aeryn Sun",
                    DateOfBirth = new DateTime(1972, 10, 11),
                    Gender = Gender.Female,
                    Email = "aeryn.sun@peacekeepers.mil.example.com",
                    HomePhoneNumber = "+6192522115",
                    MobilePhoneNumber = "+61431014986",
                    MailingAddress = new Address()
                    {
                        TenantId = _tenantId,
                        AddressType = AddressType.Home,
                        StreetAddress1 = "18 Jamison St",
                        City = "Sydny",
                        RegionId = newSouthWales.Id,
                        CountryId = australia.Id,
                        PostalCode = "2000",
                    },
                    EmployeeNumber = 1024,
                    JobTitle = "Peacekeeper Commando and Prowler Pilot, Icarion Company, Pleisar Regiment",
                    HourlyBillingRate = 85,
                    IsBillableByDefault = true,
                    HireDate = new DateTime(1999, 3, 19),
                };

                var employeeRepository = await GetEmployeeRepository();
                var savedAerynSun = await employeeRepository.InsertAsync(aerynSun);
                Assert.NotNull(savedAerynSun);
                // TODO: Assert all the things!
            });
        }

        private async Task<IEmployeeRepository> GetEmployeeRepository()
        {
            var appDbContext = await TestUtilities.GetDatabaseContextAsync();
            return new EmployeeRepository(appDbContext);
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
                    DELETE FROM ""Employee"" WHERE ""TenantId"" = @_tenantId;",
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
