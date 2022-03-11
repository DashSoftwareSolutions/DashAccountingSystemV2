﻿using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using DashAccountingSystemV2.BusinessLogic;
using DashAccountingSystemV2.Extensions;
using DashAccountingSystemV2.Services.Export;
using DashAccountingSystemV2.ViewModels;

namespace DashAccountingSystemV2.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/invoice")]
    public class InvoiceController : Controller
    {
        private readonly IInvoiceBusinessLogic _invoiceBusinessLogic = null;
        private readonly IExportService _exportService = null;

        public InvoiceController(
            IInvoiceBusinessLogic invoiceBusinessLogic,
            IExportService exportService)
        {
            _invoiceBusinessLogic = invoiceBusinessLogic;
            _exportService = exportService;
        }

        [HttpGet("{tenantId:guid}/list")]
        public Task<IActionResult> GetPaginatedFilteredInvoices(
            [FromRoute] Guid tenantId,
            [FromQuery] InvoiceFilterRequestViewModel filters,
            [FromQuery] PaginationRequestViewModel pagination)
        {
            var bizLogicResult = _invoiceBusinessLogic.GetPagedFilteredInvoices(
                tenantId,
                filters.ParsedDateRangeStart,
                filters.ParsedDateRangeEnd,
                filters.ParsedCustomerIds,
                includeInvoices: null,
                PaginationRequestViewModel.ToModel(pagination));

            return this.Result(bizLogicResult, (data) => data.ToViewModels(InvoiceLiteResponseViewModel.FromModel));
        }

        // Cannot use uint as a route parameter type constraint
        // 4294967295 is uint.MaxValue
        // See https://docs.microsoft.com/en-us/aspnet/web-api/overview/web-api-routing-and-actions/attribute-routing-in-web-api-2#route-constraints
        [HttpGet("{tenantId:guid}/{invoiceNumber:long:min(1):max(4294967295)}")]
        public Task<IActionResult> GetInvoice(
            [FromRoute] Guid tenantId,
            [FromRoute] uint invoiceNumber)
        {
            var bizLogicResponse = _invoiceBusinessLogic.GetInvoiceByTenantAndInvoiceNumber(
                tenantId,
                invoiceNumber);

            return this.Result(bizLogicResponse, InvoiceResponseViewModel.FromModel);
        }

        [HttpGet("{tenantId:guid}/terms")]
        public Task<IActionResult> GetInvoiceTerms(
            [FromRoute] Guid tenantId)
        {
            var bizLogicResponse = _invoiceBusinessLogic.GetInvoiceTermsChoicesByTenant(tenantId);
            return this.Result(bizLogicResponse, InvoiceTermsViewModel.FromModel);
        }

        [HttpPost]
        public Task<IActionResult> CreateInvoice([FromBody] InvoiceCreateRequestViewModel viewModel)
        {
            if (viewModel == null)
                return Task.FromResult(this.ErrorResponse("Invalid POST body"));

            if (!viewModel.Validate(ModelState))
                return Task.FromResult(this.ErrorResponse(ModelState));

            var contextUserId = User.GetUserId();

            var inboundInvoice = InvoiceCreateRequestViewModel.ToModel(
                viewModel,
                contextUserId);

            var bizLogicResponse = _invoiceBusinessLogic.CreateInvoice(inboundInvoice);

            return this.Result(bizLogicResponse, InvoiceResponseViewModel.FromModel);
        }

        [HttpPost("{tenantId:guid}/{invoiceNumber:long:min(1):max(4294967295)}/export-pdf")]
        public async Task<IActionResult> RequestPdfInvoice(
            [FromRoute] Guid tenantId,
            [FromRoute] uint invoiceNumber)
        {
            var bizLogicResponse = await _invoiceBusinessLogic.GetInvoiceByTenantAndInvoiceNumber(
                tenantId,
                invoiceNumber);

            if (!bizLogicResponse.IsSuccessful)
                return this.Result(bizLogicResponse);

            var exportRequestParams = new ExportRequestParameters()
            {
                ExportFormat = ExportFormat.PDF,
                ExportType = ExportType.Invoice,
                RequestingUserId = User.GetUserId(),
                TenantId = tenantId,
            };

            var exportServiceResponse = await _exportService.GetDataExport(exportRequestParams, bizLogicResponse.Data);

            if (!exportServiceResponse.IsSuccessful)
                return this.ErrorResponse(exportServiceResponse.Error);

            var result = new ExportDescriptorRequestAndResponseViewModel()
            {
                Format = exportServiceResponse.ExportFormat,
                FileName = exportServiceResponse.FileName,
                Token = exportServiceResponse.Token,
            };

            return Json(result);
        }

        [HttpPut("{tenantId:guid}/{invoiceNumber:long:min(1):max(4294967295)}")]
        public Task<IActionResult> UpdateInvoice(
            [FromRoute] Guid tenantId,
            [FromRoute] uint invoiceNumber,
            [FromBody] InvoiceUpdateRequestViewModel viewModel)
        {
            if (viewModel == null)
                return Task.FromResult(this.ErrorResponse("Invalid PUT body"));

            if (tenantId != viewModel.TenantId ||
                invoiceNumber != viewModel.InvoiceNumber)
                return Task.FromResult(this.ErrorResponse("Mismatch between route parameters and PUT body"));

            if (!viewModel.Validate(ModelState))
                return Task.FromResult(this.ErrorResponse(ModelState));

            var contextUserId = User.GetUserId();
            var invoiceWithUpdates = InvoiceUpdateRequestViewModel.ToModel(viewModel, contextUserId);

            var bizLogicResponse = _invoiceBusinessLogic.UpdateInvoice(
                invoiceWithUpdates,
                contextUserId);

            return this.Result(bizLogicResponse, InvoiceResponseViewModel.FromModel);
        }

        [HttpPut("{tenantId:guid}/{invoiceNumber:long:min(1):max(4294967295)}/status")]
        public Task<IActionResult> UpdateInvoiceStatus(
            [FromRoute] Guid tenantId,
            [FromRoute] uint invoiceNumber,
            [FromBody] InvoiceStatusUpdateRequestViewModel viewModel)
        {
            if (viewModel == null)
                return Task.FromResult(this.ErrorResponse("Invalid PUT body"));

            if (tenantId != viewModel.TenantId ||
                invoiceNumber != viewModel.InvoiceNumber)
                return Task.FromResult(this.ErrorResponse("Mismatch between route parameters and PUT body"));

            var contextUserId = User.GetUserId();

            var bizLogicResponse = _invoiceBusinessLogic.UpdateInvoiceStatus(
                tenantId,
                invoiceNumber,
                viewModel.Status,
                contextUserId);

            return this.Result(bizLogicResponse, InvoiceResponseViewModel.FromModel);
        }

        [HttpDelete("{tenantId:guid}/{invoiceNumber:long:min(1):max(4294967295)}")]
        public Task<IActionResult> DeleteDraftInvoice(
            [FromRoute] Guid tenantId,
            [FromRoute] uint invoiceNumber)
        {
            var contextUserId = User.GetUserId();
            return this.Result(_invoiceBusinessLogic.DeleteDraftInvoice(tenantId, invoiceNumber, contextUserId));
        }
    }
}
