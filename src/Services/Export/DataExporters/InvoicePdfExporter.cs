using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using SelectPdf;
using DashAccountingSystemV2.Extensions;
using DashAccountingSystemV2.Models;
using DashAccountingSystemV2.Services.Template;

namespace DashAccountingSystemV2.Services.Export.DataExporters
{
    public class InvoicePdfExporter : IDataExporter<Invoice>
    {
        private const string _InvoiceTemplate = "DefaultInvoiceTemplate.cshtml"; // TODO: _SOMEDAY_ we may have multiple template options, allow end-user customization by tenant, etc.  For now, this is all we have; take it or leave it! =)

        private readonly ILogger _logger = null;
        private readonly ITemplateService _templateService = null;

        public InvoicePdfExporter(
            ITemplateService templateService,
            ILogger<BalanceSheetReportExcelExporter> logger)
        {
            _templateService = templateService;
            _logger = logger;
        }

        public Task<ExportedDataDto> GetDataExport(ExportRequestParameters parameters, Invoice data)
        {
            return Task.FromResult(new ExportedDataDto());
        }
    }
}
