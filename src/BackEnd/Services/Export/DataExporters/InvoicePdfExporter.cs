using QuestPDF.Fluent;
using DashAccountingSystemV2.BackEnd.Models;
using DashAccountingSystemV2.BackEnd.Services.Export.PdfDocuments;

namespace DashAccountingSystemV2.BackEnd.Services.Export.DataExporters
{
    public class InvoicePdfExporter(ILogger<InvoicePdfExporter> logger) : IDataExporter<Invoice>
    {
        public Task<ExportedDataDto?> GetDataExport(ExportRequestParameters parameters, Invoice data)
        {
            logger.LogInformation("Exporting Invoice {invoiceNumber} for Tenant {tenant}", data.InvoiceNumber, data.Tenant);

            try
            {
                // TODO: User's Time Zone.  This will work for now since, when running locally, machine time is Pacific Time.
                var invoiceAsPdfBytes = new InvoiceDocument(data, DateTime.Now).GeneratePdf();

                return Task.FromResult<ExportedDataDto?>(new ExportedDataDto()
                {
                    Content = invoiceAsPdfBytes,
                    FileName = $"Invoice_{data.InvoiceNumber}",
                });
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error generating PDF Invoice");
                return Task.FromResult<ExportedDataDto?>(null);
            }
        }
    }
}
