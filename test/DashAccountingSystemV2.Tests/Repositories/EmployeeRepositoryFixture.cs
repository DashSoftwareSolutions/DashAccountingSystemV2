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
                        CreatedById = _userId,
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

        [Fact]
        [Trait("Category", "Requires Database")]
        public void GetByTenantIdAsync_Ok()
        {
            TestUtilities.RunTestAsync(Initialize, Cleanup, async () =>
            {
                await InitializeManyEmployees();

                var repository = await GetEmployeeRepository();

                var results1 = await repository.GetByTenantIdAsync(_tenantId);
                Assert.Equal(3, results1.Count());

                var results2 = await repository.GetByTenantIdAsync(_tenantId, new uint[] { 1024, 2048 });
                Assert.Equal(2, results2.Count());
                Assert.Contains(results2, e => e.EmployeeNumber == 1024);
                Assert.Contains(results2, e => e.EmployeeNumber == 2048);

                // TODO: Test and Assert that filtering by Active ones works
            });
        }

        private async Task InitializeManyEmployees()
        {
            var sharedLookupsRepository = await GetSharedLookupRepository();

            var unitedStates = (await sharedLookupsRepository.GetCountriesAsync())
                .FirstOrDefault(c => c.ThreeLetterCode == "USA");

            var usStatesAndTerritories = await sharedLookupsRepository.GetRegionsByCountryAlpha3CodeAsync("USA");

            var california = usStatesAndTerritories.FirstOrDefault(r => r.Code == "CA");
            var newYork = usStatesAndTerritories.FirstOrDefault(r => r.Code == "NY");

            var employeeRepository = await GetEmployeeRepository();

            var employee1 = new Employee()
            {
                Entity = new Entity()
                {
                    TenantId = _tenantId,
                    EntityType = EntityType.Person | EntityType.Employee,
                    CreatedById = _userId,
                },
                TenantId = _tenantId,
                Title = "Mr.",
                FirstName = "Geoffrey",
                LastName = "Roberts",
                DisplayName = "Geoffrey Roberts",
                Gender = Gender.Male,
                Email = "geoffrey.roberts@example.com",
                MobilePhoneNumber = "+17145553333",
                MailingAddress = new Address()
                {
                    TenantId = _tenantId,
                    AddressType = AddressType.Home,
                    StreetAddress1 = "123 Some St",
                    City = "Fullerton",
                    RegionId = california.Id,
                    CountryId = unitedStates.Id,
                    PostalCode = "92832",
                    CreatedById = _userId,
                },
                EmployeeNumber = 101,
                JobTitle = "Software Dude",
                HourlyBillingRate = 60,
                IsBillableByDefault = true,
                HireDate = new DateTime(2018, 3, 1),
                UserId = _userId,
            };

            var savedEmployee1 = await employeeRepository.InsertAsync(employee1);

            var employee2 = new Employee()
            {
                Entity = new Entity()
                {
                    TenantId = _tenantId,
                    EntityType = EntityType.Person | EntityType.Employee,
                    CreatedById = _userId,
                },
                TenantId = _tenantId,
                Title = "Miss",
                FirstName = "Julia",
                LastName = "Wicker",
                DisplayName = "Julia Wicker",
                Gender = Gender.Male,
                Email = "julia.wicker@example.com",
                MobilePhoneNumber = "+13475554567",
                MailingAddress = new Address()
                {
                    TenantId = _tenantId,
                    AddressType = AddressType.Home,
                    StreetAddress1 = "1283 Pride Avenue",
                    City = "Brooklyn",
                    RegionId = newYork.Id,
                    CountryId = unitedStates.Id,
                    PostalCode = "11235",
                    CreatedById = _userId,
                },
                EmployeeNumber = 1024,
                JobTitle = "Magician",
                HourlyBillingRate = 70,
                IsBillableByDefault = true,
                HireDate = new DateTime(2018, 4, 1),
            };

            var savedEmployee2 = await employeeRepository.InsertAsync(employee2);

            var employee3 = new Employee()
            {
                Entity = new Entity()
                {
                    TenantId = _tenantId,
                    EntityType = EntityType.Person | EntityType.Employee,
                    CreatedById = _userId,
                },
                TenantId = _tenantId,
                Title = "Miss",
                FirstName = "Kady",
                LastName = "Orloff-Diaz",
                DisplayName = "Kady Orloff-Diaz",
                Gender = Gender.Male,
                Email = "kady.orloff-diaz@example.com",
                MobilePhoneNumber = "+17185556789",
                MailingAddress = new Address()
                {
                    TenantId = _tenantId,
                    AddressType = AddressType.Home,
                    StreetAddress1 = "3229 Church Street",
                    City = "Brooklyn",
                    RegionId = newYork.Id,
                    CountryId = unitedStates.Id,
                    PostalCode = "11227",
                    CreatedById = _userId,
                },
                EmployeeNumber = 2048,
                JobTitle = "Magician",
                HourlyBillingRate = 68,
                IsBillableByDefault = true,
                HireDate = new DateTime(2018, 5, 1),
            };

            var savedEmployee3 = await employeeRepository.InsertAsync(employee3);
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
                    DELETE FROM ""Employee"" WHERE ""TenantId"" = @_tenantId;",
                    parameters);

                await connection.ExecuteAsync(@"
                    DELETE FROM ""Address"" WHERE ""TenantId"" = @_tenantId;",
                    parameters);

                await connection.ExecuteAsync(@"
                    DELETE FROM ""Entity"" WHERE ""TenantId"" = @_tenantId;",
                    parameters);

                await connection.ExecuteAsync(@"
                    DELETE FROM ""Tenant"" WHERE ""Id"" = @_tenantId;",
                    parameters);
            }
        }
    }
}
