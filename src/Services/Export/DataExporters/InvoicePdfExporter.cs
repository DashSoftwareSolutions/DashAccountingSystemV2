﻿using System;
using System.Drawing;
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

        // TODO: Consider making Page Header and Footer Partial Views
        private const string _PageHeaderTemplateFormat = @"
<div style=""float: left;"">
    Invoice {0}
</div>
<div style = ""float: right; font-family: Arial; font-size: 14px;"">
    {1}
</div>
<div style=""clear:both; border-bottom: 1px solid; padding-top: 5px; padding-bottom: 5px;"">
</div>
";
        private const string _PageFooterTemplateFormat = @"
<div style=""clear:both; border-top: 1px solid; padding-top: 5px; padding-bottom: 5px;"">
</div>
<div style=""float: left; font-family: Arial; font-size: 14px;"">
    {0}
</div>
";
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
                // Use the Invoice Razor Template to get an HTML Invoice
                var invoiceAsHtml = await _templateService.GetHtmlFromRazorTemplate(_InvoiceTemplateName, invoice);

                // Setup the PDF Converter
                var pdfConverter = new HtmlToPdf();
                pdfConverter.Options.PdfPageSize = PdfPageSize.A4; // standard 8.5" x 11" page size
                pdfConverter.Options.PdfPageOrientation = PdfPageOrientation.Portrait;
                pdfConverter.Options.WebPageWidth = 1024;
                pdfConverter.Options.WebPageHeight = 0; // height will be auto-detected
                pdfConverter.Options.MarginTop = 10;
                pdfConverter.Options.MarginBottom = 10;
                pdfConverter.Options.MarginLeft = 20;
                pdfConverter.Options.MarginRight = 20;

                // Specify Page Header Options
                pdfConverter.Options.DisplayHeader = true;
                pdfConverter.Header.DisplayOnFirstPage = false;
                pdfConverter.Header.DisplayOnOddPages = true;
                pdfConverter.Header.DisplayOnEvenPages = true;
                pdfConverter.Header.Height = 50;

                var headerHtml = new PdfHtmlSection(string.Format(_PageHeaderTemplateFormat, invoice.InvoiceNumber, invoice.Tenant.Name), string.Empty);
                headerHtml.AutoFitHeight = HtmlToPdfPageFitMode.AutoFit;
                pdfConverter.Header.Add(headerHtml);

                // Specify Page Footer Options with Page Numbers
                pdfConverter.Options.DisplayFooter = true;
                pdfConverter.Footer.DisplayOnFirstPage = true;
                pdfConverter.Footer.DisplayOnOddPages = true;
                pdfConverter.Footer.DisplayOnEvenPages = true;
                pdfConverter.Footer.Height = 50;

                var footerHtml = new PdfHtmlSection(string.Format(_PageFooterTemplateFormat, DateTime.Now.ToString("f")), string.Empty); // TODO: User's Time Zone.  This will work for now since, when running locally, machine time is Pacific Time.
                footerHtml.AutoFitHeight = HtmlToPdfPageFitMode.AutoFit;
                pdfConverter.Footer.Add(footerHtml);

                var pageNumbersText = new PdfTextSection(0, 10, "Page {page_number} of {total_pages}  ", new Font("Arial", 8));
                pageNumbersText.HorizontalAlign = PdfTextHorizontalAlign.Center;
                pdfConverter.Footer.Add(pageNumbersText);


                // Convert the HTML Invoice to PDF
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
