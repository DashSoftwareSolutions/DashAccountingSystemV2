using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using DashAccountingSystemV2.BackEnd.Extensions;
using DashAccountingSystemV2.BackEnd.Security.Authorization;
using DashAccountingSystemV2.BackEnd.Services.Caching;
using DashAccountingSystemV2.BackEnd.Services.Export;
using DashAccountingSystemV2.BackEnd.ViewModels;
using static DashAccountingSystemV2.BackEnd.Security.Constants;
using static DashAccountingSystemV2.BackEnd.Services.Caching.Constants;

namespace DashAccountingSystemV2.BackEnd.Controllers
{
    [ApiAuthorize(ExportDownloadAuthenticationScheme)]
    [ApiController]
    [Route("api/export-download")]
    public class ExportDownloadController(IExtendedDistributedCache cache, ILogger<ExportDownloadController> logger) : ControllerBase
    {
        [HttpGet]
        public async Task<IActionResult> DownloadExport([FromQuery] ExportDescriptorRequestAndResponseViewModel viewModel)
        {
            if (viewModel == null)
                return this.ErrorResponse("Invalid download request");

            var tenantId = User.FindFirstValue(DashClaimTypes.TenantId);
            logger.LogInformation("Tenant ID is {tenantId}", tenantId);

            var cacheKey = $"{ApplicationCacheKeyPrefix}/{tenantId}/{viewModel.FileName}";

            var exportContent = await cache.GetAsync(cacheKey);

            if (exportContent == null)
                return this.ErrorResponse("Requested data export not found", StatusCodes.Status404NotFound);

            var fileNameWithExtension = AppendExtensionToFileName(viewModel.FileName, viewModel.Format);
            var mimeType = GetMimeTypeFromFormat(viewModel.Format);

            this.AppendContentDispositionResponseHeader(fileNameWithExtension);
            return new FileContentResult(exportContent, mimeType);
        }

        private static string AppendExtensionToFileName(string baseFileName, ExportFormat format)
        {
            var extension = format == ExportFormat.Unknown ?
                string.Empty :
                $".{format.ToString().ToLower()}";

            return $"{baseFileName}{extension}";
        }

        private static string GetMimeTypeFromFormat(ExportFormat format)
        {
            return format switch
            {
                ExportFormat.CSV => CSV_MIME_TYPE,
                ExportFormat.PDF => PDF_MIME_TYPE,
                ExportFormat.XLSX => EXCEL_MIME_TYPE,
                _ => throw new ArgumentOutOfRangeException(nameof(format), $"Export Format \'{format}\' is not valid"),
            };
        }

        private static readonly string CSV_MIME_TYPE = "text/csv";
        private static readonly string EXCEL_MIME_TYPE = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
        private static readonly string PDF_MIME_TYPE = "application/pdf";
    }
}
