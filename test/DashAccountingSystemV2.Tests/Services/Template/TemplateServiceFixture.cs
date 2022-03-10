using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Xunit;
using DashAccountingSystemV2.Models;
using DashAccountingSystemV2.Services.Template;

namespace DashAccountingSystemV2.Tests.Services.Template
{
    public class TemplateServiceFixture
    {
        [Fact]
        public async Task GetHtmlFromRazorTemplate_Ok()
        {
            var loggerFactory = TestUtilities.GetLoggerFactory();
            var templateProvider = new FileSystemTemplateProvider(loggerFactory.CreateLogger<FileSystemTemplateProvider>()); // TODO: Mock this dependency.  For now, using live one.
            var subjectUnderTest = new TemplateService(templateProvider, loggerFactory.CreateLogger<TemplateService>());

            var tenantName = "Chocolate Milk Corporation";
            var invoiceNumber = (uint)1234;

            var invoice = new Invoice()
            {
                Tenant = new Tenant(tenantName),
                InvoiceNumber = invoiceNumber,
            };

            var templateName = "DefaultInvoiceTemplate.cshtml";

            var result = await subjectUnderTest.GetHtmlFromRazorTemplate(templateName, invoice);

            Assert.False(
                string.IsNullOrWhiteSpace(result),
                "Expect GetHtmlFromRazorTemplate() to have returned a non-empty string containing the HTML content generated from the specified Razor Template and model object");

            Assert.Contains(tenantName, result);
            Assert.Contains(invoiceNumber.ToString(), result);
        }
    }
}
