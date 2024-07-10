/*
using Microsoft.Extensions.Logging;
using DashAccountingSystemV2.BackEnd.Services.Template;

namespace DashAccountingSystemV2.Tests.Services.Template
{
    public class FileSystemTemplateProviderFixture
    {
        [Fact]
        public async Task GetTemplate_Ok()
        {
            var loggerFactory = TestUtilities.GetLoggerFactory();
            var subjectUnderTest = new FileSystemTemplateProvider(loggerFactory.CreateLogger<FileSystemTemplateProvider>());
            var templateName = "DefaultInvoiceTemplate.cshtml";

            var templateContent = await subjectUnderTest.GetTemplate(templateName);

            Assert.False(string.IsNullOrWhiteSpace(templateContent), "Expect GetTemplate() to have returned a non-empty string containing the template content");
        }
    }
}
*/