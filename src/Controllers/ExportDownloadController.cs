using System;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using DashAccountingSystemV2.Extensions;
using DashAccountingSystemV2.ViewModels;
using DashAccountingSystemV2.Services.Caching;
using DashAccountingSystemV2.Services.Export;
using static DashAccountingSystemV2.Security.Constants;
using static DashAccountingSystemV2.Services.Caching.Constants;

namespace DashAccountingSystemV2.Controllers
{
    [Authorize(AuthenticationSchemes = ExportDownloadAuthenticationScheme)]
    [ApiController]
    [Route("api/export-download")]
    public class ExportDownloadController : Controller
    {
        private readonly IExtendedDistributedCache _cache = null;

        public ExportDownloadController(IExtendedDistributedCache cache)
        {
            _cache = cache;
        }

        public async Task<IActionResult> DownloadExport([FromQuery] ExportDescriptorRequestAndResponseViewModel viewModel)
        {
            if (viewModel == null)
                return this.ErrorResponse("Invalid download request");

            var tenantId = User.FindFirstValue(DashClaimTypes.TenantId);
            var cacheKey = $"{ApplicationCacheKeyPrefix}/{tenantId}/{viewModel.FileName}";

            var exportContent = await _cache.GetAsync(cacheKey);

            if (exportContent == null)
                return this.ErrorResponse("Requested data export not found", StatusCodes.Status404NotFound);

            var fileNameWithExtension = AppendExtensionToFileName(viewModel.FileName, viewModel.Format);
            var mimeType = GetMimeTypeFromFormat(viewModel.Format);

            this.AppendContentDispositionResponseHeader(fileNameWithExtension);
            return new FileContentResult(exportContent, mimeType);
        }

        private string AppendExtensionToFileName(string baseFileName, ExportFormat format)
        {
            var extension = format == ExportFormat.Unknown ?
                string.Empty :
                $".{format.ToString().ToLower()}";

            return $"{baseFileName}{extension}";
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
