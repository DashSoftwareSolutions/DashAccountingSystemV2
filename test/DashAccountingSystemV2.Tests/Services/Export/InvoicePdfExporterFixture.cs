using System.Text;
using Microsoft.Extensions.Logging;
using DashAccountingSystemV2.BackEnd.Models;
using DashAccountingSystemV2.BackEnd.Services.Export;
using DashAccountingSystemV2.BackEnd.Services.Export.DataExporters;
using DashAccountingSystemV2.BackEnd.Services.Export.PdfDocuments;

namespace DashAccountingSystemV2.Tests.Services.Export
{
    public class InvoicePdfExporterFixture
    {
        /// <summary>
        /// Set this environment variable to a directory path to have the test write the generated PDF there for visual inspection.
        /// </summary>
        private const string _OutputDirectoryEnvironmentVariable = "DASH_TEST_PDF_OUTPUT_DIR";

        public InvoicePdfExporterFixture()
        {
            QuestPdfConfiguration.EnsureConfigured();
        }

        [Fact]
        public async Task GetDataExport_LongInvoice_Ok()
        {
            // Many line items with long descriptions; the previous HTML-to-PDF converter truncated invoices like this one
            var invoice = CreateInvoice(lineItemCount: 150);

            var subjectUnderTest = new InvoicePdfExporter(TestUtilities.GetLoggerFactory().CreateLogger<InvoicePdfExporter>());

            var result = await subjectUnderTest.GetDataExport(
                new ExportRequestParameters() { ExportType = ExportType.Invoice, ExportFormat = ExportFormat.PDF },
                invoice);

            Assert.NotNull(result);
            Assert.Equal($"Invoice_{invoice.InvoiceNumber}", result.FileName);
            Assert.NotNull(result.Content);
            Assert.Equal("%PDF", Encoding.ASCII.GetString(result.Content, 0, 4));

            var outputDirectory = Environment.GetEnvironmentVariable(_OutputDirectoryEnvironmentVariable);

            if (!string.IsNullOrWhiteSpace(outputDirectory))
            {
                await File.WriteAllBytesAsync(Path.Combine(outputDirectory, $"{result.FileName}.pdf"), result.Content);
            }
        }

        private static Invoice CreateInvoice(int lineItemCount)
        {
            var tenant = new Tenant("Chocolate Milk Corporation")
            {
                ContactEmailAddress = "billing@chocolatemilk.example",
                MailingAddress = new Address()
                {
                    StreetAddress1 = "123 Main Street",
                    City = "Fullerton",
                    Region = new Region() { Code = "CA", Name = "California" },
                    PostalCode = "92831",
                    Country = new Country() { Name = "United States of America" },
                },
            };

            var invoice = new Invoice()
            {
                Tenant = tenant,
                InvoiceNumber = 1234,
                CustomerAddress = "Acme Widgets, Inc.\n1 Widget Way\nLake Forest, CA 92630\nUnited States of America",
                InvoiceTerms = new InvoiceTerms() { Name = "Net 30" },
                IssueDate = new DateTime(2026, 9, 22),
                DueDate = new DateTime(2026, 10, 22),
                Message = "Thank you for your business!",
            };

            for (var i = 1; i <= lineItemCount; i++)
            {
                var descriptionSentences = 1 + (i % 5); // vary the row heights

                invoice.LineItems.Add(new InvoiceLineItem()
                {
                    OrderNumber = (ushort)i,
                    Date = new DateTime(2026, 9, 1).AddDays(i / 10),
                    Description = $"Line item {i} - " +
                        string.Join(" ", Enumerable.Repeat("Lorem ipsum dolor sit amet, consectetur adipiscing elit.", descriptionSentences)) +
                        "\n--> 9:00 AM - 9:30 AM, 30 mins @ $85.00/hr",
                    Quantity = 0.5m,
                    UnitPrice = 85.00m,
                    Total = 42.50m,
                });
            }

            return invoice;
        }
    }
}
