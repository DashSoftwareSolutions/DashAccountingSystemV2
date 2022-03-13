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
    public class PaymentRepositoryFixture
    {
        private Guid _tenantId;
        private Guid _userId;
        private Account _cashOperatingAccount;
        private Account _revenueAccount;
        private AssetType _assetTypeUSD;
        private Customer _customer;
        private Employee _employee;
        private Invoice _invoice;
        private JournalEntry _paymentJournalEntry;
        private PaymentMethod _paymentMethodCheck;
        private ProductCategory _productCategory;
        private Product _product1;
        private Product _product2;
        private Product _product3;
        private TimeActivity _timeActivity1;
        private TimeActivity _timeActivity2;
        private TimeActivity _timeActivity3;

        private static readonly DateTime _timeActivitiesDate = new DateTime(2022, 2, 17, 0, 0, 0, DateTimeKind.Utc);

        [Fact]
        [Trait("Category", "Requires Database")]
        public void Insert_Payment_Ok()
        {
            TestUtilities.RunTestAsync(Initialize, Cleanup, async () =>
            {
                var payment = new Payment()
                {
                    TenantId = _tenantId,
                    CustomerId = _customer.EntityId,
                    DepositAccountId = _cashOperatingAccount.Id,
                    RevenueAccountId = _revenueAccount.Id,
                    PaymentMethodId = _paymentMethodCheck.Id,
                    Date = new DateTime(2022, 2, 27, 0, 0, 0, DateTimeKind.Utc),
                    Amount = _invoice.Total,
                    AssetTypeId = _assetTypeUSD.Id,
                    CheckNumber = 12345,
                    JournalEntryId = _paymentJournalEntry.Id,
                    CreatedById = _userId,
                    Invoices = new InvoicePayment[]
                    {
                        new InvoicePayment() { InvoiceId = _invoice.Id, Amount = _invoice.Total },
                    },
                };

                var subjectUnderTest = await GetPaymentRepository();

                var savedPayment = await subjectUnderTest.InsertAsync(payment);

                Assert.NotNull(savedPayment);
                // TODO: Assert all the things on the Payment object!

                // Check Payments navigation property on Invoice
                var invoiceRepository = await GetInvoiceRepository();
                var paidInvoice = await invoiceRepository.GetDetailedByIdAsync(_invoice.Id);
                Assert.NotNull(paidInvoice);
                var paidInvoicePayment = Assert.Single(paidInvoice.Payments);
                Assert.Equal(savedPayment.Id, paidInvoicePayment.PaymentId);
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
                            TimeActivities = new InvoiceLineItemTimeActivity[]
                            {
                                new InvoiceLineItemTimeActivity()
                                {
                                    TimeActivityId = _timeActivity1.Id,
                                }
                            }
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
                            TimeActivities = new InvoiceLineItemTimeActivity[]
                            {
                                new InvoiceLineItemTimeActivity()
                                {
                                    TimeActivityId = _timeActivity2.Id,
                                }
                            }
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
                            TimeActivities = new InvoiceLineItemTimeActivity[]
                            {
                                new InvoiceLineItemTimeActivity()
                                {
                                    TimeActivityId = _timeActivity3.Id,
                                }
                            }
                        },
                },
            };

            return invoice;
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

        private async Task<IInvoiceRepository> GetInvoiceRepository()
        {
            var appDbContext = await TestUtilities.GetDatabaseContextAsync();
            return new InvoiceRepository(appDbContext);
        }

        private async Task<IJournalEntryRepository> GetJournalEntryRepository()
        {
            var appDbContext = await TestUtilities.GetDatabaseContextAsync();
            return new JournalEntryRepository(appDbContext);
        }

        private async Task<IPaymentRepository> GetPaymentRepository()
        {
            var appDbContext = await TestUtilities.GetDatabaseContextAsync();
            return new PaymentRepository(appDbContext);
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

        private async Task<Account> MakeAccount(
            ushort accountNumber,
            string name,
            AccountType accountType,
            AccountSubType accountSubType,
            AssetType assetType,
            AmountType balanceType)
        {
            var account = new Account(
                _tenantId,
                accountNumber,
                name,
                null,
                accountType.Id,
                accountSubType.Id,
                assetType.Id,
                balanceType,
                _userId);

            var accountRepository = await GetAccountRepository();
            var savedAccount = await accountRepository.CreateAccountAsync(account);

            Assert.NotNull(savedAccount);
            Assert.True(savedAccount.Id != Guid.Empty);

            return savedAccount;
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
                    EntityType = EntityType.ExternalOrganization | EntityType.Customer,
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
                    CreatedById = _userId,
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
                    CreatedById = _userId,
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
                Date = _timeActivitiesDate,
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
                Date = _timeActivitiesDate,
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
                Date = _timeActivitiesDate,
                StartTime = new TimeSpan(13, 0, 0),
                EndTime = new TimeSpan(16, 0, 0),
                TimeZone = "Australia/Sydney",
                Description = "Combat Space Patrol\r\n--> 1:00 PM - 4:00 PM",
                IsBillable = true,
                HourlyBillingRate = 125.00m,
                CreatedById = _userId,
            };

            _timeActivity3 = await MakeTimeActivity(timeActivity3);

            // Initialize Invoice
            var invoice = await BuildInvoice();
            var invoiceRepository = await GetInvoiceRepository();
            _invoice = await invoiceRepository.CreateInvoiceAsync(invoice);

            // Initialize Accounts
            var accountRepository = await GetAccountRepository();

            var accountTypes = await sharedLookupsRepository.GetAccountTypesAsync();
            var accountTypeAsset = accountTypes.Single(at => at.Name == "Asset");

            var accountSubTypes = await sharedLookupsRepository.GetAccountSubTypesAsync();
            var accountSubTypeBankAccount = accountSubTypes.Single(ast => ast.Name == "Bank Account");

            var assetTypes = await sharedLookupsRepository.GetAssetTypesAsync();
            _assetTypeUSD = assetTypes.Single(at => at.Name == "USD");

           _cashOperatingAccount = await MakeAccount(
                1010, "Shadow Depository Operating Cash Account", accountTypeAsset, accountSubTypeBankAccount, _assetTypeUSD, AmountType.Debit);

            var accountTypeRevenue = accountTypes.Single(at => at.Name == "Revenue");
            var accountSubTypeOperatingRevenue = accountSubTypes.Single(ast => ast.Name == "Operating Revenue");

            _revenueAccount = await MakeAccount(
                4010, "Revenue for Peacekeeper Operations", accountTypeRevenue, accountSubTypeOperatingRevenue, _assetTypeUSD, AmountType.Credit);

            // Initialize Payment Method
            var paymentMethods = await sharedLookupsRepository.GetPaymentMethodsAsync();
            _paymentMethodCheck = paymentMethods.FirstOrDefault(pm => pm.Name == "Check");

            // Initialize Payment Journal Entry
            var entryDate = new DateTime(2022, 2, 27, 0, 0, 0, DateTimeKind.Utc);

            var journalEntry = new JournalEntry(
                _tenantId,
                entryDate,
                null,
                $"Payment for Invoice # {_invoice.InvoiceNumber}",
                null,
                _userId,
                null);

            var transactionAmount = 10000.00m;

            journalEntry.Accounts.Add(new JournalEntryAccount(
                _cashOperatingAccount.Id, transactionAmount, _assetTypeUSD.Id));
            journalEntry.Accounts.Add(new JournalEntryAccount(
                _revenueAccount.Id, -transactionAmount, _assetTypeUSD.Id));

            var journalEntryRepository = await GetJournalEntryRepository();

            _paymentJournalEntry = await journalEntryRepository.CreateJournalEntryAsync(journalEntry);
        }

        private async Task Cleanup()
        {
            var connString = TestUtilities.GetConnectionString();

            using (var connection = new NpgsqlConnection(connString))
            {
                var parameters = new { _tenantId };

                await connection.ExecuteAsync(@"
                    DELETE FROM ""InvoicePayment"" WHERE ""InvoiceId"" IN ( SELECT ""Id"" FROM ""Invoice"" WHERE ""TenantId"" = @_tenantId );",
                    parameters);

                await connection.ExecuteAsync(@"
                    DELETE FROM ""Payment"" WHERE ""TenantId"" = @_tenantId;",
                    parameters);

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
                    DELETE FROM ""Account"" WHERE ""TenantId"" = @_tenantId;",
                    parameters);

                await connection.ExecuteAsync(@"
                    DELETE FROM ""Tenant"" WHERE ""Id"" = @_tenantId;",
                    parameters);
            }
        }
    }
}
