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
    public class InvoiceRepositoryFixture
    {
        private Guid _tenantId;
        private Guid _userId;
        private Customer _customer;
        private Employee _employee;
        private ProductCategory _productCategory;
        private Product _product1;
        private Product _product2;
        private Product _product3;
        private TimeActivity _timeActivity1;
        private TimeActivity _timeActivity2;
        private TimeActivity _timeActivity3;

        [Fact]
        [Trait("Category", "Requires Database")]
        public void Invoice_CRUD_Ok()
        {
            TestUtilities.RunTestAsync(Initialize, Cleanup, async () =>
            {
                var invoice = await BuildInvoice();

                var subjectUnderTest = await GetInvoiceRepository();

                // Test Create
                var savedInvoice = await subjectUnderTest.CreateInvoiceAsync(invoice);

                Assert.NotNull(savedInvoice);
                // TODO: Assert all the things!

                // Test Get Filtered Invoices by Tenant
                // TODO: More robust testing of filtering options
                var filteredPagedInvoices = await subjectUnderTest.GetFilteredAsync(
                    _tenantId,
                    dateRangeStart: null,
                    dateRangeEnd: null,
                    includeCustomers: null,
                    pagination: Pagination.Default);

                Assert.NotNull(filteredPagedInvoices);
                Assert.Equal(1, filteredPagedInvoices.Total);
                Assert.Equal(1, filteredPagedInvoices.PageCount);
                Assert.False(filteredPagedInvoices.ContainsMoreRecords, "Expect 'ContainsMoreRecords' to be false (initial case where there is 1 result)");
                var retrievedInvoiceFromFilteredResults = Assert.Single(filteredPagedInvoices.Results, i => i.Id == savedInvoice.Id);
                Assert.Equal(savedInvoice.Total, retrievedInvoiceFromFilteredResults.Total);

                // Test various Gets
                var retrievedById = await subjectUnderTest.GetByIdAsync(savedInvoice.Id);
                Assert.NotNull(retrievedById);
                // TODO: Assert all the things!

                var retrievedDetailedById = await subjectUnderTest.GetDetailedByIdAsync(savedInvoice.Id);
                Assert.NotNull(retrievedDetailedById);
                // TODO: Assert all the things!

                var retrievedByInvoiceNumber = await subjectUnderTest.GetByTenantIdAndInvoiceNumberAsync(_tenantId, savedInvoice.InvoiceNumber);
                Assert.NotNull(retrievedByInvoiceNumber);
                // TODO: Assert all the things!

                var retrievedDetailedByInvoiceNumber = await subjectUnderTest.GetDetailedByTenantIdAndInvoiceNumberAsync(_tenantId, savedInvoice.InvoiceNumber);
                Assert.NotNull(retrievedDetailedByInvoiceNumber);
                // TODO: Assert all the things!

                // TODO: Test Full Update (including changing line items)

                // Test Delete
                await subjectUnderTest.DeleteAsync(savedInvoice.Id, _userId);

                // Verify we can no longer retreive the deleted Invoice
                retrievedById = await subjectUnderTest.GetByIdAsync(savedInvoice.Id);
                Assert.Null(retrievedById);

                retrievedDetailedById = await subjectUnderTest.GetDetailedByIdAsync(savedInvoice.Id);
                Assert.Null(retrievedDetailedById);

                retrievedByInvoiceNumber = await subjectUnderTest.GetByTenantIdAndInvoiceNumberAsync(_tenantId, savedInvoice.InvoiceNumber);
                Assert.Null(retrievedByInvoiceNumber);

                retrievedDetailedByInvoiceNumber = await subjectUnderTest.GetDetailedByTenantIdAndInvoiceNumberAsync(_tenantId, savedInvoice.InvoiceNumber);
                Assert.Null(retrievedDetailedByInvoiceNumber);

                filteredPagedInvoices = await subjectUnderTest.GetFilteredAsync(
                    _tenantId,
                    dateRangeStart: null,
                    dateRangeEnd: null,
                    includeCustomers: null,
                    pagination: Pagination.Default);

                Assert.NotNull(filteredPagedInvoices);
                Assert.Equal(0, filteredPagedInvoices.Total);
                Assert.Equal(0, filteredPagedInvoices.PageCount);
                Assert.Empty(filteredPagedInvoices.Results);
                Assert.False(filteredPagedInvoices.ContainsMoreRecords, "Expect 'ContainsMoreRecords' to be false (second case where there are 0 results 'cause we deleted the invoice)");
            });
        }

        [Fact]
        [Trait("Category", "Requires Database")]
        public void Invoice_UpdateStatus_Ok()
        {
            TestUtilities.RunTestAsync(Initialize, Cleanup, async () =>
            {
                var invoice = await BuildInvoice();

                var subjectUnderTest = await GetInvoiceRepository();

                var savedInvoice = await subjectUnderTest.CreateInvoiceAsync(invoice);

                Assert.NotNull(savedInvoice);

                var newInvoiceStatus = InvoiceStatus.Sent;
                
                var invoiceWithUpdatedStatus = await subjectUnderTest.UpdateInvoiceStatusAsync(
                    _tenantId,
                    savedInvoice.InvoiceNumber,
                    newInvoiceStatus,
                    _userId);

                Assert.NotNull(invoiceWithUpdatedStatus);
                Assert.Equal(newInvoiceStatus, invoiceWithUpdatedStatus.Status);
                Assert.NotNull(invoiceWithUpdatedStatus.Updated);
            });
        }

        private async Task<Invoice> BuildInvoice()
        {
            var net30InvoiceTerms = await GetInvoiceTerms("Net 30");
            var assetTypeUSD = await GetAssetType("USD");

            // Create Invoice
            var invoice = new Invoice()
            {
                Status = InvoiceStatus.Draft,
                TenantId = _tenantId,
                CustomerId = _customer.EntityId,
                CustomerEmail = _customer.Email,
                CustomerAddress = $@"{_customer.DisplayName}
{_customer.BillingAddress.StreetAddress1}
{_customer.BillingAddress.City} {_customer.BillingAddress.Region.Code} {_customer.BillingAddress.PostalCode}
{_customer.BillingAddress.Country.Name}",
                InvoiceTermsId = net30InvoiceTerms.Id,
                IssueDate = new DateTime(2022, 2, 18),
                DueDate = new DateTime(2022, 3, 24),
                Message = "Unit Testing Invoice!",
                CreatedById = _userId,
                LineItems = new InvoiceLineItem[]
                {
                        new InvoiceLineItem()
                        {
                            OrderNumber = 1,
                            Date = _timeActivity1.Date,
                            ProductId = _timeActivity1.ProductId,
                            Description = _timeActivity1.Description,
                            Quantity = (decimal)_timeActivity1.TotalTime.TotalHours,
                            UnitPrice = _timeActivity1.HourlyBillingRate.Value,
                            Total = _timeActivity1.TotalBillableAmount,
                            AssetTypeId = assetTypeUSD.Id,
                            CreatedById = _userId,
                        },
                        new InvoiceLineItem()
                        {
                            OrderNumber = 2,
                            Date = _timeActivity2.Date,
                            ProductId = _timeActivity2.ProductId,
                            Description = _timeActivity2.Description,
                            Quantity = (decimal)_timeActivity2.TotalTime.TotalHours,
                            UnitPrice = _timeActivity2.HourlyBillingRate.Value,
                            Total = _timeActivity2.TotalBillableAmount,
                            AssetTypeId = assetTypeUSD.Id,
                            CreatedById = _userId,
                        },
                        new InvoiceLineItem()
                        {
                            OrderNumber = 3,
                            Date = _timeActivity3.Date,
                            ProductId = _timeActivity3.ProductId,
                            Description = _timeActivity3.Description,
                            Quantity = (decimal)_timeActivity3.TotalTime.TotalHours,
                            UnitPrice = _timeActivity3.HourlyBillingRate.Value,
                            Total = _timeActivity3.TotalBillableAmount,
                            AssetTypeId = assetTypeUSD.Id,
                            CreatedById = _userId,
                        },
                },
            };

            return invoice;
        }

        private async Task<ISharedLookupRepository> GetSharedLookupRepository()
        {
            var appDbContext = await TestUtilities.GetDatabaseContextAsync();
            return new SharedLookupRepository(appDbContext);
        }

        private async Task<IInvoiceRepository> GetInvoiceRepository()
        {
            var appDbContext = await TestUtilities.GetDatabaseContextAsync();
            return new InvoiceRepository(appDbContext);
        }

        private async Task<AssetType> GetAssetType(string assetType)
        {
            var appDbContext = await TestUtilities.GetDatabaseContextAsync();
            return await appDbContext.AssetType.FirstOrDefaultAsync(at => at.Name == assetType);
        }

        private async Task<InvoiceTerms> GetInvoiceTerms(string invoiceTermsName)
        {
            var appDbContext = await TestUtilities.GetDatabaseContextAsync();
            return await appDbContext.InvoiceTerms.FirstOrDefaultAsync(it => it.Name == invoiceTermsName);
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

        private async Task<TimeActivity> MakeTimeActivity(TimeActivity timeActivity)
        {
            var appDbContext = await TestUtilities.GetDatabaseContextAsync();
            var repository = new TimeActivityRepository(appDbContext);
            return await repository.InsertAsync(timeActivity);
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

            // Initialize Products
            var product1 = new Product()
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

            _product1 = await MakeProduct(product1);

            var product2 = new Product()
            {
                TenantId = _tenantId,
                Type = ProductType.Service,
                CategoryId = _productCategory.Id,
                Name = "Physical Training",
                NormalizedName = "Physical Training".ToUpper(),
                Description = "Physical Training",
                SalesPriceOrRate = 25.00m,
                CreatedById = _userId,
            };

            _product2 = await MakeProduct(product2);

            var product3 = new Product()
            {
                TenantId = _tenantId,
                Type = ProductType.Service,
                CategoryId = _productCategory.Id,
                Name = "Pulse Rifle Traget Practice",
                NormalizedName = "Pulse Rifle Traget Practice".ToUpper(),
                Description = "Pulse Rifle Traget Practice",
                SalesPriceOrRate = 50.00m,
                CreatedById = _userId,
            };

            _product3 = await MakeProduct(product3);

            // Initialize Time Activities
            var timeActivity1 = new TimeActivity()
            {
                TenantId = _tenantId,
                CustomerId = _customer.EntityId,
                EmployeeId = _employee.EntityId,
                ProductId = _product2.Id,
                Date = new DateTime(2022, 2, 17, 0, 0, 0, DateTimeKind.Utc),
                StartTime = new TimeSpan(6, 0, 0),
                EndTime = new TimeSpan(8, 0, 0),
                TimeZone = "Australia/Sydney",
                Description = "Physical Training\r\n--> 6:00 AM - 8:00 AM",
                IsBillable = true,
                HourlyBillingRate = 25.00m,
                CreatedById = _userId,
            };

            _timeActivity1 = await MakeTimeActivity(timeActivity1);

            var timeActivity2 = new TimeActivity()
            {
                TenantId = _tenantId,
                CustomerId = _customer.EntityId,
                EmployeeId = _employee.EntityId,
                ProductId = _product3.Id,
                Date = new DateTime(2022, 2, 17, 0, 0, 0, DateTimeKind.Utc),
                StartTime = new TimeSpan(9, 0, 0),
                EndTime = new TimeSpan(10, 0, 0),
                TimeZone = "Australia/Sydney",
                Description = "Pulse Rifle Traget Practice\r\n--> 9:00 AM - 10:00 AM",
                IsBillable = true,
                HourlyBillingRate = 50.00m,
                CreatedById = _userId,
            };

            _timeActivity2 = await MakeTimeActivity(timeActivity2);

            var timeActivity3 = new TimeActivity()
            {
                TenantId = _tenantId,
                CustomerId = _customer.EntityId,
                EmployeeId = _employee.EntityId,
                ProductId = _product1.Id,
                Date = new DateTime(2022, 2, 17, 0, 0, 0, DateTimeKind.Utc),
                StartTime = new TimeSpan(13, 0, 0),
                EndTime = new TimeSpan(16, 0, 0),
                TimeZone = "Australia/Sydney",
                Description = "Combat Space Patrol\r\n--> 1:00 PM - 4:00 PM",
                IsBillable = true,
                HourlyBillingRate = 125.00m,
                CreatedById = _userId,
            };

            _timeActivity3 = await MakeTimeActivity(timeActivity3);
        }

        private async Task Cleanup()
        {
            var connString = TestUtilities.GetConnectionString();

            using (var connection = new NpgsqlConnection(connString))
            {
                var parameters = new { _tenantId };

                await connection.ExecuteAsync(@"
                    DELETE FROM ""InvoiceLineItem"" WHERE ""InvoiceId"" IN ( SELECT ""Id"" FROM ""Invoice"" WHERE ""TenantId"" = @_tenantId );",
                    parameters);

                await connection.ExecuteAsync(@"
                    DELETE FROM ""Invoice"" WHERE ""TenantId"" = @_tenantId;",
                    parameters);

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
