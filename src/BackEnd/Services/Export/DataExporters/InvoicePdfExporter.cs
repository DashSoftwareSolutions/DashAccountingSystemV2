using MigraDocCore.DocumentObjectModel;
using MigraDocCore.Rendering;
using DashAccountingSystemV2.BackEnd.Models;

namespace DashAccountingSystemV2.BackEnd.Services.Export.DataExporters
{
    public class InvoicePdfExporter(ILogger<InvoicePdfExporter> logger) : IDataExporter<Invoice>
    {
        public Task<ExportedDataDto?> GetDataExport(ExportRequestParameters parameters, Invoice data)
        {
            logger.LogInformation("Exporting Invoice {invoiceNumber} for Tenant {tenant}", data.InvoiceNumber, data.Tenant);

            var documentSubject = $"{data.Tenant.Name} - Invoice ${data.InvoiceNumber}";

            var document = new Document();
            document.Info.Title = documentSubject;
            document.Info.Author = "Dash Accounting System 2.1";
            document.Info.Subject = documentSubject;

            var section = document.AddSection();
            var color = Colors.Black;

            var paragraph = section.AddParagraph();
            paragraph.Format.SpaceBefore = Unit.FromPoint(24);
            paragraph.Format.Font.Color = color;
            paragraph.Format.Font.Size = Unit.FromPoint(24);

            paragraph.AddFormattedText(data.Tenant.Name, TextFormat.Bold);

            paragraph = section.AddParagraph();
            paragraph.Format.Font.Color = color;
            paragraph.Format.Font.Size = Unit.FromPoint(24);
            paragraph.AddFormattedText($"Fake Invoice #{data.InvoiceNumber}", TextFormat.Bold);

            // TODO: build Real invoice

            // Create a renderer for the MigraDocCore document.
            var pdfRenderer = new PdfDocumentRenderer(unicode: true)
            {
                Document = document,
            };

            // Layout and render document to PDF
            pdfRenderer.RenderDocument();

            // Save the document and return the stream
            var stream = new MemoryStream();
            pdfRenderer.PdfDocument.Save(stream);

            return Task.FromResult<ExportedDataDto?>(new ExportedDataDto()
            {
                Content = stream.ToArray(),
                FileName = $"Invoice_{data.InvoiceNumber}",
            });
        }
    }
}
