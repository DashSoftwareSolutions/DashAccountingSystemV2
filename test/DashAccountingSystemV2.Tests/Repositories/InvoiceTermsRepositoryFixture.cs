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
    public class InvoiceTermsRepositoryFixture
    {
        private Guid _tenantId;
        private Guid _userId;

        [Fact]
        [Trait("Category", "Requires Database")]
        public void GetInvoiceTermsChoicesAsync_Ok()
        {
            TestUtilities.RunTestAsync(Initialize, Cleanup, async () =>
            {
                var subjectUnderTest = await GetInvoiceTermsRepository();
                
                var results = await subjectUnderTest.GetInvoiceTermsChoicesAsync(_tenantId);
                
                Assert.Equal(3, results.Count());
                
                var defaultNet30Terms = Assert.Single(results, it => it.Name == "Net 30");
                Assert.Equal((ushort)30, defaultNet30Terms.DueInDays);
                Assert.Null(defaultNet30Terms.DueOnDayOfMonth);
                Assert.Null(defaultNet30Terms.DueNextMonthThreshold);

                var defaultNet60Terms = Assert.Single(results, it => it.Name == "Net 60");
                Assert.Equal((ushort)60, defaultNet60Terms.DueInDays);
                Assert.Null(defaultNet60Terms.DueOnDayOfMonth);
                Assert.Null(defaultNet60Terms.DueNextMonthThreshold);

                var defaultNet90Terms = Assert.Single(results, it => it.Name == "Net 90");
                Assert.Equal((ushort)90, defaultNet90Terms.DueInDays);
                Assert.Null(defaultNet90Terms.DueOnDayOfMonth);
                Assert.Null(defaultNet90Terms.DueNextMonthThreshold);
            });
        }

        [Fact]
        public void InvoiceTerms_CRUD_Test()
        {
            TestUtilities.RunTestAsync(Initialize, Cleanup, async () =>
            {
                var subjectUnderTest = await GetInvoiceTermsRepository();

                var dueOnThe15thTerms = new InvoiceTerms()
                {
                    TenantId = _tenantId,
                    Name = "Due on the 15th",
                    DueOnDayOfMonth = 15,
                    CreatedById = _userId,
                };

                var savedTerms = await subjectUnderTest.InsertAsync(dueOnThe15thTerms);
                Assert.NotNull(savedTerms);
                Assert.NotEqual(Guid.Empty, savedTerms.Id);

                var allInvoiceTerms = await subjectUnderTest.GetInvoiceTermsChoicesAsync(_tenantId);

                Assert.Equal(4, allInvoiceTerms.Count());
                Assert.Single(allInvoiceTerms, it => it.Name == "Net 30");
                Assert.Single(allInvoiceTerms, it => it.Name == "Net 60");
                Assert.Single(allInvoiceTerms, it => it.Name == "Net 90");

                var retrievedDueOnThe15thTerms = Assert.Single(allInvoiceTerms, it => it.Name == dueOnThe15thTerms.Name);
                Assert.Equal(savedTerms.Id, retrievedDueOnThe15thTerms.Id);
                Assert.Equal((ushort)15, retrievedDueOnThe15thTerms.DueOnDayOfMonth);
                Assert.Null(retrievedDueOnThe15thTerms.DueInDays);
                Assert.Null(retrievedDueOnThe15thTerms.DueNextMonthThreshold);

                var updatedTerms = savedTerms.Clone<InvoiceTerms>();
                updatedTerms.Name = "Due on the 16th";
                updatedTerms.DueOnDayOfMonth = 16;
                updatedTerms.DueNextMonthThreshold = 5;

                var savedUpdatedTerms = await subjectUnderTest.UpdateAsync(updatedTerms, _userId);

                Assert.Equal(updatedTerms.Name, savedUpdatedTerms.Name);
                Assert.Equal(updatedTerms.DueInDays, savedUpdatedTerms.DueInDays);
                Assert.Equal(updatedTerms.DueNextMonthThreshold, savedUpdatedTerms.DueNextMonthThreshold);
                Assert.Equal(updatedTerms.DueOnDayOfMonth, savedUpdatedTerms.DueOnDayOfMonth);

                await subjectUnderTest.DeleteAsync(savedUpdatedTerms.Id, _userId);

                Assert.Null(await subjectUnderTest.GetByIdAsync(savedUpdatedTerms.Id));
            });
        }

        private async Task<IInvoiceTermsRepository> GetInvoiceTermsRepository()
        {
            var appDbContext = await TestUtilities.GetDatabaseContextAsync();
            return new InvoiceTermsRepository(appDbContext);
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
                    DELETE FROM ""InvoiceTerms"" WHERE ""TenantId"" = @_tenantId;",
                    parameters);

                await connection.ExecuteAsync(@"
                    DELETE FROM ""Tenant"" WHERE ""Id"" = @_tenantId;",
                    parameters);
            }
        }
    }
}
