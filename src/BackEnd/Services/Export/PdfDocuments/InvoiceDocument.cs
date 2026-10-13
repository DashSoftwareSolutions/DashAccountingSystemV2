using System.Reflection;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using DashAccountingSystemV2.BackEnd.Models;

namespace DashAccountingSystemV2.BackEnd.Services.Export.PdfDocuments
{
    /// <summary>
    /// QuestPDF document layout for a PDF Invoice.<br />
    /// <see href="https://www.questpdf.com/"/>
    /// </summary>
    public class InvoiceDocument(Invoice invoice, DateTime generatedAt) : IDocument
    {
        private const string _LogoResourceName = "DashAccountingSystemV2.BackEnd.PdfAssets.InvoiceLogo.jpg";

        private const string _DateFormat = "MM/dd/yyyy"; // TODO: i18n/l10n -- don't like standard format "d" due to it not using two digit months and days

        private static readonly Color _TableHeaderBackgroundColor = Color.FromHex("#6DCFF6");
        private static readonly Color _TableHeaderTextColor = Color.FromHex("#134174");
        private static readonly Color _RuleColor = Colors.Grey.Medium;

        // TODO: _SOMEDAY_ the logo should be configurable per tenant.  For now, this is all we have; take it or leave it! =)
        private static readonly Lazy<byte[]> _logo = new(LoadLogo);

        public DocumentMetadata GetMetadata() => new()
        {
            Title = $"{invoice.Tenant.Name} - Invoice {invoice.InvoiceNumber}",
            Author = "Dash Accounting System 2.1",
            CreationDate = DateTimeOffset.UtcNow,
            Language = "en", // TODO: l10n / i18n
        };

        public DocumentSettings GetSettings() => DocumentSettings.Default;

        public void Compose(IDocumentContainer container)
        {
            container.Page(page =>
            {
                page.Size(PageSizes.Letter);
                page.Margin(0.5f, Unit.Inch);
                page.DefaultTextStyle(style => style.FontFamily(QuestPdfConfiguration.DefaultFontFamily).FontSize(10));

                page.Header().SkipOnce().Element(ComposeRunningHeader); // Not on the first page; it has the full letterhead instead
                page.Content().Element(ComposeContent);
                page.Footer().Element(ComposeFooter);
            });
        }

        private void ComposeRunningHeader(IContainer container)
        {
            container
                .PaddingBottom(10)
                .BorderBottom(0.5f)
                .BorderColor(_RuleColor)
                .PaddingBottom(4)
                .Row(row =>
                {
                    row.RelativeItem().Text($"Invoice {invoice.InvoiceNumber}");
                    row.RelativeItem().AlignRight().Text(invoice.Tenant.Name);
                });
        }

        private void ComposeFooter(IContainer container)
        {
            container
                .PaddingTop(10)
                .BorderTop(0.5f)
                .BorderColor(_RuleColor)
                .PaddingTop(4)
                .DefaultTextStyle(style => style.FontSize(8))
                .Row(row =>
                {
                    row.RelativeItem().Text(generatedAt.ToString("f"));

                    row.RelativeItem().AlignCenter().Text(text =>
                    {
                        text.Span("Page ");
                        text.CurrentPageNumber();
                        text.Span(" of ");
                        text.TotalPages();
                    });

                    row.RelativeItem();
                });
        }

        private void ComposeContent(IContainer container)
        {
            container.Column(column =>
            {
                column.Item().Element(ComposeLetterhead);

                column.Item().PaddingVertical(16).Text("Invoice").FontSize(24).Bold();

                column.Item().Element(ComposeBillToAndInvoiceMetadata);

                column.Item().PaddingVertical(10).LineHorizontal(0.5f).LineColor(_RuleColor);

                column.Item().Element(ComposeLineItemsTable);

                column.Item().PaddingVertical(10).LineHorizontal(0.5f).LineColor(_RuleColor);

                // Keep the balance due block together; never strand part of it on its own page
                column.Item().ShowEntire().Element(ComposeBalanceDue);
            });
        }

        private void ComposeLetterhead(IContainer container)
        {
            var tenant = invoice.Tenant;
            var mailingAddress = tenant.MailingAddress;

            container.Row(row =>
            {
                row.RelativeItem().Column(column =>
                {
                    column.Item().Text(tenant.Name).Bold();

                    // TODO: Handle international addresses
                    if (mailingAddress != null)
                    {
                        column.Item().Text(mailingAddress.StreetAddress1);

                        if (!string.IsNullOrWhiteSpace(mailingAddress.StreetAddress2))
                        {
                            column.Item().Text(mailingAddress.StreetAddress2);
                        }

                        column.Item().Text($"{mailingAddress.City}, {mailingAddress.Region?.Code} {mailingAddress.PostalCode}");
                        column.Item().Text(mailingAddress.Country?.Name);
                    }

                    if (!string.IsNullOrWhiteSpace(tenant.ContactEmailAddress))
                    {
                        column.Item().Text(tenant.ContactEmailAddress);
                    }
                });

                row.ConstantItem(1.5f, Unit.Inch).AlignRight().Image(_logo.Value).FitWidth();
            });
        }

        private void ComposeBillToAndInvoiceMetadata(IContainer container)
        {
            container.Row(row =>
            {
                row.RelativeItem(2).Column(column =>
                {
                    column.Item().PaddingBottom(8).Text("Bill To").FontSize(16).Bold();
                    column.Item().Text(invoice.CustomerAddress ?? string.Empty);
                });

                row.RelativeItem(1).AlignBottom().Table(table =>
                {
                    table.ColumnsDefinition(columns =>
                    {
                        columns.ConstantColumn(72);
                        columns.RelativeColumn();
                    });

                    AddMetadataRow(table, "Invoice #", invoice.InvoiceNumber.ToString());
                    AddMetadataRow(table, "Date", invoice.IssueDate.ToString(_DateFormat));
                    AddMetadataRow(table, "Due Date", invoice.DueDate.ToString(_DateFormat));
                    AddMetadataRow(table, "Terms", invoice.InvoiceTerms?.Name ?? string.Empty);
                });
            });
        }

        private static void AddMetadataRow(TableDescriptor table, string label, string value)
        {
            table.Cell().PaddingBottom(4).PaddingRight(6).AlignRight().Text(label.ToUpperInvariant()).Bold();
            table.Cell().PaddingBottom(4).Text(value);
        }

        private void ComposeLineItemsTable(IContainer container)
        {
            container.Table(table =>
            {
                table.ColumnsDefinition(columns =>
                {
                    columns.RelativeColumn(1);
                    columns.RelativeColumn(4);
                    columns.RelativeColumn(1);
                });

                // QuestPDF repeats the table header on every page the table spans
                table.Header(header =>
                {
                    header.Cell().Element(HeaderCell).Text("DATE");
                    header.Cell().Element(HeaderCell).Text("DESCRIPTION");
                    header.Cell().Element(HeaderCell).AlignRight().Text("AMOUNT");

                    static IContainer HeaderCell(IContainer cell) => cell
                        .Background(_TableHeaderBackgroundColor)
                        .Padding(4)
                        .DefaultTextStyle(style => style.Bold().FontColor(_TableHeaderTextColor));
                });

                foreach (var lineItem in invoice.LineItems.OrderBy(li => li.OrderNumber))
                {
                    // ShowEntire() moves a line item to the next page rather than splitting it across two
                    table.Cell().Element(BodyCell).Text(lineItem.Date.ToString(_DateFormat));
                    table.Cell().Element(BodyCell).Text(lineItem.GetBillableItemDescription());
                    table.Cell().Element(BodyCell).AlignRight().Text(lineItem.Total.ToString("C")); // TODO: Asset Type?  l10n/i18n?
                }

                static IContainer BodyCell(IContainer cell) => cell
                    .BorderBottom(0.25f)
                    .BorderColor(Colors.Grey.Lighten2)
                    .Padding(4)
                    .ShowEntire();
            });
        }

        private void ComposeBalanceDue(IContainer container)
        {
            container.PaddingTop(6).Row(row =>
            {
                row.RelativeItem(2).PaddingRight(24).Text(invoice.Message ?? string.Empty);
                row.RelativeItem(1).Text("BALANCE DUE");
                row.RelativeItem(1).AlignRight().Text(invoice.Total.ToString("C")).FontSize(18).Bold(); // TODO: Asset Type?  l10n/i18n?
            });
        }

        private static byte[] LoadLogo()
        {
            using var stream = Assembly.GetExecutingAssembly().GetManifestResourceStream(_LogoResourceName)
                ?? throw new InvalidOperationException($"Embedded resource '{_LogoResourceName}' not found");

            using var memoryStream = new MemoryStream();
            stream.CopyTo(memoryStream);
            return memoryStream.ToArray();
        }
    }
}
