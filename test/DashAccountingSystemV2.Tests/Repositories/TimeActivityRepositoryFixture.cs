using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Dapper;
using Npgsql;
using Xunit;
using DashAccountingSystemV2.Extensions;
using DashAccountingSystemV2.Models;
using DashAccountingSystemV2.Repositories;

namespace DashAccountingSystemV2.Tests.Repositories
{
    public class TimeActivityRepositoryFixture
    {
        private Guid _tenantId;
        private Guid _userId;
        private Customer _customer;
        private Employee _employee;
        private ProductCategory _productCategory;
        private Product _product;

        [Fact]
        [Trait("Category", "Requires Database")]
        public void CreateTimeActivity_Ok()
        {
            TestUtilities.RunTestAsync(Initialize, Cleanup, async () =>
            {
                var timeActivity = new TimeActivity()
                {
                    TenantId = _tenantId,
                    CustomerId = _customer.EntityId,
                    EmployeeId = _employee.EntityId,
                    ProductId = _product.Id,
                    Date = new DateTime(2021, 7, 14, 0, 0, 0, DateTimeKind.Utc),
                    StartTime = new TimeSpan(9, 0, 0),
                    EndTime = new TimeSpan(16, 0, 0),
                    Break = new TimeSpan(2, 0, 0),
                    TimeZone = "Australia/Sydney",
                    Description = "Combat Space Patrol\r\n--> 9:00 AM - 12:00 PM / 2:00 PM - 4:00 PM",
                    IsBillable = true,
                    HourlyBillingRate = 125.00m,
                    CreatedById = _userId,
                };

                var subjectUnderTest = await GetTimeActivityRepository();
                var savedTimeActivity = await subjectUnderTest.InsertAsync(timeActivity);
                Assert.NotNull(savedTimeActivity);
                Assert.Equal(TimeSpan.FromHours(5), savedTimeActivity.TotalTime); // 7 hours - 2 hour break
                Assert.Equal(5 * savedTimeActivity.HourlyBillingRate, savedTimeActivity.TotalBillableAmount);
                // Assert all the other things!

                // Also quick test for GetFiltered()
                // TODO: A more robust test where we make lots of time entries and exercise the filter options
                var retrived = await subjectUnderTest.GetFiltered(
                    _tenantId,
                    new DateTime(2021, 7, 14),
                    new DateTime(2021, 7, 14));

                Assert.NotEmpty(retrived);
                Assert.Contains(retrived, ta => ta.Id == savedTimeActivity.Id);
            });
        }

        [Fact]
        [Trait("Category", "Requires Database")]
        public void UpdateTimeActivity_Ok()
        {
            TestUtilities.RunTestAsync(Initialize, Cleanup, async () =>
            {
                // Create Initial Time Activity
                var timeActivity = new TimeActivity()
                {
                    TenantId = _tenantId,
                    CustomerId = _customer.EntityId,
                    EmployeeId = _employee.EntityId,
                    ProductId = _product.Id,
                    Date = new DateTime(2021, 7, 14, 0, 0, 0, DateTimeKind.Utc),
                    StartTime = new TimeSpan(9, 0, 0),
                    EndTime = new TimeSpan(16, 0, 0),
                    Break = new TimeSpan(2, 0, 0),
                    TimeZone = "Australia/Sydney",
                    Description = "Combat Space Patrol\r\n--> 9:00 AM - 12:00 PM / 2:00 PM - 4:00 PM",
                    IsBillable = true,
                    HourlyBillingRate = 125.00m,
                    CreatedById = _userId,
                };

                var subjectUnderTest = await GetTimeActivityRepository();
                var savedTimeActivity = await subjectUnderTest.InsertAsync(timeActivity);
                Assert.NotNull(savedTimeActivity);
                Assert.Equal(TimeSpan.FromHours(5), savedTimeActivity.TotalTime); // 7 hours - 2 hour break
                Assert.Equal(5 * savedTimeActivity.HourlyBillingRate, savedTimeActivity.TotalBillableAmount);

                // Make some changes
                var timeActivityWithUpdates = savedTimeActivity.Clone<TimeActivity>();
                timeActivityWithUpdates.StartTime = new TimeSpan(11, 0, 0);
                timeActivityWithUpdates.EndTime = new TimeSpan(15, 0, 0);
                timeActivityWithUpdates.Break = new TimeSpan(1, 0, 0);
                timeActivityWithUpdates.Description = "Combat Space Patrol (UPDATED)\r\n--> 11:00 AM - 12:00 PM / 1:00 PM - 3:00 PM";
                timeActivityWithUpdates.HourlyBillingRate = 130.00m;

                // TODO/FIXME: Using copy constructor so that the lazily computed TotalTime and TotalBillableAmount properties are reset
                // Dunno if this is a unit test problem or a real probem ... stay tuned!
                var updatedTimeActivity = new TimeActivity(await subjectUnderTest.UpdateAsync(timeActivityWithUpdates, _userId));

                Assert.NotNull(updatedTimeActivity);
                Assert.Equal(TimeSpan.FromHours(3), updatedTimeActivity.TotalTime); // 4 hours - 1 hour break
                Assert.Equal(3 * updatedTimeActivity.HourlyBillingRate, updatedTimeActivity.TotalBillableAmount);
            });
        }

        [Fact]
        [Trait("Category", "Requires Database")]
        public void DeleteTimeActivity_Ok()
        {
            TestUtilities.RunTestAsync(Initialize, Cleanup, async () =>
            {
                // Create Initial Time Activity
                var timeActivity = new TimeActivity()
                {
                    TenantId = _tenantId,
                    CustomerId = _customer.EntityId,
                    EmployeeId = _employee.EntityId,
                    ProductId = _product.Id,
                    Date = new DateTime(2021, 7, 14, 0, 0, 0, DateTimeKind.Utc),
                    StartTime = new TimeSpan(9, 0, 0),
                    EndTime = new TimeSpan(16, 0, 0),
                    Break = new TimeSpan(2, 0, 0),
                    TimeZone = "Australia/Sydney",
                    Description = "Combat Space Patrol\r\n--> 9:00 AM - 12:00 PM / 2:00 PM - 4:00 PM",
                    IsBillable = true,
                    HourlyBillingRate = 125.00m,
                    CreatedById = _userId,
                };

                var subjectUnderTest = await GetTimeActivityRepository();
                var savedTimeActivity = await subjectUnderTest.InsertAsync(timeActivity);
                Assert.NotNull(savedTimeActivity);
                Assert.Equal(TimeSpan.FromHours(5), savedTimeActivity.TotalTime); // 7 hours - 2 hour break
                Assert.Equal(5 * savedTimeActivity.HourlyBillingRate, savedTimeActivity.TotalBillableAmount);

                // Verify we can retrieve it by ID
                var retrieved = await subjectUnderTest.GetByIdAsync(savedTimeActivity.Id);
                Assert.NotNull(retrieved);

                // Delete it!
                await subjectUnderTest.DeleteAsync(savedTimeActivity.Id, _userId);

                // Verify we can no longer retrieve it by ID
                retrieved = await subjectUnderTest.GetByIdAsync(savedTimeActivity.Id);
                Assert.Null(retrieved);
            });
        }

        private async Task<ISharedLookupRepository> GetSharedLookupRepository()
        {
            var appDbContext = await TestUtilities.GetDatabaseContextAsync();
            return new SharedLookupRepository(appDbContext);
        }

        private async Task<ITimeActivityRepository> GetTimeActivityRepository()
        {
            var appDbContext = await TestUtilities.GetDatabaseContextAsync();
            return new TimeActivityRepository(appDbContext);
        }

        private async Task<Customer> MakeCustomer(Customer customer)
        {
            var appDbContext = await TestUtilities.GetDatabaseContextAsync();
            var repository = new CustomerRepository(appDbContext);
            return await repository.InsertAsync(customer);
        }

        private async Task<Employee> MakeEmployee(Employee employee)
        {
            var appDbContext = await TestUtilities.GetDatabaseContextAsync();
            var repository = new EmployeeRepository(appDbContext);
            return await repository.InsertAsync(employee);
        }

        private async Task<ProductCategory> MakeProductCategory(ProductCategory productCategory)
        {
            var appDbContext = await TestUtilities.GetDatabaseContextAsync();
            var repository = new ProductRepository(appDbContext);
            return await repository.InsertCategory(productCategory);
        }

        private async Task<Product> MakeProduct(Product product)
        {
            var appDbContext = await TestUtilities.GetDatabaseContextAsync();
            var repository = new ProductRepository(appDbContext);
            return await repository.InsertProduct(product);
        }

        private async Task Initialize()
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

            // Initialize Customer
            var sharedLookupsRepository = await GetSharedLookupRepository();

            var australia = (await sharedLookupsRepository.GetCountriesAsync())
                .FirstOrDefault(c => c.ThreeLetterCode == "AUS");

            var newSouthWales = (await sharedLookupsRepository.GetRegionsByCountryAlpha3CodeAsync("AUS"))
                .FirstOrDefault(r => r.Code == "NSW");

            var customer = new Customer()
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

            _customer = await MakeCustomer(customer);

            // Initialize Employee
            var employee = new Employee()
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

            _employee = await MakeEmployee(employee);

            // Initialize Product Category
            var productCategory = new ProductCategory()
            {
                TenantId = _tenantId,
                Name = "Peacekeeper Military Operations",
                NormalizedName = "Peacekeeper Military Operations".ToUpper(),
                CreatedById = _userId,
            };

            _productCategory = await MakeProductCategory(productCategory);

            // Initialize Product
            var product = new Product()
            {
                TenantId = _tenantId,
                Type = ProductType.Service,
                CategoryId = _productCategory.Id,
                Name = "Prowler Combat Space Patrol",
                NormalizedName = "Prowler Combat Space Patrol".ToUpper(),
                Description = "Fly Prowler combat spacecraft on assigned route and report and engage any detected hostiles per specified rules of engagement",
                SalesPriceOrRate = 123.45m,
                CreatedById = _userId,
            };

            _product = await MakeProduct(product);
        }

        private async Task Cleanup()
        {
            var connString = TestUtilities.GetConnectionString();

            using (var connection = new NpgsqlConnection(connString))
            {
                var parameters = new { _tenantId };

                await connection.ExecuteAsync(@"
                    DELETE FROM ""TimeActivity"" WHERE ""TenantId"" = @_tenantId;",
                    parameters);

                await connection.ExecuteAsync(@"
                    DELETE FROM ""Employee"" WHERE ""TenantId"" = @_tenantId;",
                    parameters);

                await connection.ExecuteAsync(@"
                    DELETE FROM ""Product"" WHERE ""TenantId"" = @_tenantId;",
                    parameters);

                await connection.ExecuteAsync(@"
                    DELETE FROM ""ProductCategory"" WHERE ""TenantId"" = @_tenantId;",
                    parameters);

                await connection.ExecuteAsync(@"
                    DELETE FROM ""Customer"" WHERE ""TenantId"" = @_tenantId;",
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
