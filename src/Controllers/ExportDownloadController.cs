using System;
using System.Threading.Tasks;
using System.IO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ClosedXML.Report;
using DashAccountingSystemV2.BusinessLogic;
using DashAccountingSystemV2.Extensions;
using DashAccountingSystemV2.ViewModels;
using DashAccountingSystemV2.Models;
using DashAccountingSystemV2.Security.ExportDownloads;
using DashAccountingSystemV2.Services.Export;
using static DashAccountingSystemV2.Security.Constants;

namespace DashAccountingSystemV2.Controllers
{
    [Authorize(AuthenticationSchemes = ExportDownloadAuthenticationScheme)]
    [ApiController]
    [Route("api/export-download")]
    public class ExportDownloadController : Controller
    {
        public async Task<IActionResult> DownloadExport([FromQuery] ExportDescriptorRequestAndResponseViewModel viewModel)
        {
            using (var template = new XLTemplate(@$"{AppContext.BaseDirectory}\ExcelTemplates\BalanceSheetReport.xlsx"))
            {
                template.AddVariable("tenant", new Tenant("Dash Software Solutions, Inc."));
                template.AddVariable("reportDates", new { DateRangeEnd = new DateTime(2018, 9, 30).ToString("D") });
                template.Generate();

                using (var ms = new MemoryStream())
                {
                    template.SaveAs(ms);
                    ms.Position = 0;
                    this.AppendContentDispositionResponseHeader("foo.xlsx");
                    return new FileContentResult(ms.ToArray(), EXCEL_MIME_TYPE);
                }
            }
        }

        private string GetMimeTypeFromFormat(ExportFormat format)
        {
            switch (format)
            {
                case ExportFormat.CSV:
                    return CSV_MIME_TYPE;
                
                case ExportFormat.XLSX:
                    return EXCEL_MIME_TYPE;

                case ExportFormat.PDF:
                    return PDF_MIME_TYPE;

                case ExportFormat.Unknown:
                default:
                    throw new ArgumentOutOfRangeException(nameof(format), $"Export Format \'{format}\' is not valid");
            }
        }

        private static readonly string CSV_MIME_TYPE = "text/csv";
        private static readonly string EXCEL_MIME_TYPE = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
        private static readonly string PDF_MIME_TYPE = "application/pdf";
    }
}
