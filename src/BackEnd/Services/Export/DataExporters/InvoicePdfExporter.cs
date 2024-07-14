using DashAccountingSystemV2.BackEnd.Models;

namespace DashAccountingSystemV2.BackEnd.Services.Export.DataExporters
{
    public class InvoicePdfExporter(ILogger<InvoicePdfExporter> logger) : IDataExporter<Invoice>
    {
        public Task<ExportedDataDto?> GetDataExport(ExportRequestParameters parameters, Invoice data)
        {
            logger.LogInformation("Exporting Invoice {invoiceNumber} for Tenant {tenant}", data.InvoiceNumber, data.Tenant);

            // TODO: Implement me!

            return Task.FromResult<ExportedDataDto?>(null);
        }
    }
}
