using System;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using SelectPdf;
using DashAccountingSystemV2.Models;
using DashAccountingSystemV2.Services.Template;

namespace DashAccountingSystemV2.Services.Export.DataExporters
{
    public class InvoicePdfExporter : IDataExporter<Invoice>
    {
        private const string _InvoiceTemplateName = "DefaultInvoiceTemplate.cshtml"; // TODO: _SOMEDAY_ we may have multiple template options, allow end-user customization by tenant, etc.  For now, this is all we have; take it or leave it! =)

        private readonly ILogger _logger = null;
        private readonly ITemplateService _templateService = null;

        public InvoicePdfExporter(
            ITemplateService templateService,
            ILogger<BalanceSheetReportExcelExporter> logger)
        {
            _templateService = templateService;
            _logger = logger;
        }

        public async Task<ExportedDataDto> GetDataExport(ExportRequestParameters parameters, Invoice invoice)
        {
            try
            {
                var invoiceAsHtml = await _templateService.GetHtmlFromRazorTemplate(_InvoiceTemplateName, invoice);

                var pdfConverter = new HtmlToPdf();
                pdfConverter.Options.PdfPageSize = PdfPageSize.A4; // standard 8.5" x 11" page size
                pdfConverter.Options.PdfPageOrientation = PdfPageOrientation.Portrait;
                pdfConverter.Options.WebPageWidth = 1024;
                pdfConverter.Options.WebPageHeight = 0; // height will be auto-detected

                // TODO: Specify more options for page headers and such

                var invoiceAsPdf = pdfConverter.ConvertHtmlString(invoiceAsHtml);
                invoiceAsPdf.DocumentInformation.Title = $"{invoice.Tenant.Name} - Invoice ${invoice.InvoiceNumber}";
                invoiceAsPdf.DocumentInformation.Author = "Dash Accounting System 2.0";
                invoiceAsPdf.DocumentInformation.CreationDate = DateTime.UtcNow;
                invoiceAsPdf.DocumentInformation.Language = "en"; // TODO: l10n / i18n 

                var invoiceAsPdfBytes = invoiceAsPdf.Save();

                return new ExportedDataDto()
                {
                    Content = invoiceAsPdfBytes,
                    FileName = $"Invoice_{invoice.InvoiceNumber}",
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating PDF Invoice");
                return null;
            }
        }
    }
}
