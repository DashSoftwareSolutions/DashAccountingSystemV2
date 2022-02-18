using System;
using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using DashAccountingSystemV2.Extensions;
using DashAccountingSystemV2.Models;
using DashAccountingSystemV2.ViewModels.Serialization;

namespace DashAccountingSystemV2.ViewModels
{
    public class InvoiceCreateRequestViewModel
    {
        [Required(ErrorMessage = "Tenant ID is required.")]
        public Guid TenantId { get; set; }

        [Required(ErrorMessage = "Status is required.")]
        [JsonConverter(typeof(StringEnumConverter))]
        public InvoiceStatus Status { get; set; }

        [Required(ErrorMessage = "Customer ID is required.")]
        public Guid CustomerId { get; set; }

        [MaxLength(256, ErrorMessage = "Customer Email cannot exceed 256 characters in length.")]
        public string CustomerEmail { get; set; }

        [MaxLength(2048, ErrorMessage = "Customer Address cannot exceed 2048 characters in length.")]
        public string CustomerAddress { get; set; }

        [Required(ErrorMessage = "Invoice Terms is required.")]
        public Guid InvoiceTermsId { get; set; }

        [DataType(DataType.Date)]
        [Required(ErrorMessage = "Issue Date is required.")]
        [JsonConverter(typeof(JsonDateConverter))]
        public DateTime IssueDate { get; set; }

        [DataType(DataType.Date)]
        [Required(ErrorMessage = "Due Date is required.")]
        [JsonConverter(typeof(JsonDateConverter))]
        public DateTime DueDate { get; set; }

        [MaxLength(2048, ErrorMessage = "Invoice Message exceed 2048 characters in length.")]
        public string Message { get; set; }

        public IEnumerable<InvoiceLineItemRequestViewModel> LineItems { get; set; }

        public bool Validate(ModelStateDictionary modelState)
        {
            if (DueDate < IssueDate)
            {
                modelState.AddModelError("DueDate", "Invoice Due Date is before the Issue Date.");
                return false;
            }

            if (LineItems.IsEmpty())
            {
                modelState.AddModelError("LineItems", "Invoice does not have any Line Items.");
                return false;
            }

            if (LineItems.Any(li => !li.UnitPrice.HasValue))
            {
                modelState.AddModelError("LineItems", "Invoice has one or more Line Items with an invalid Unit Price.");
                return false;
            }

            return modelState.IsValid;
        }

        public static Invoice ToModel(InvoiceCreateRequestViewModel viewModel, Guid contextUserId)
        {
            if (viewModel == null)
                return null;

            return new Invoice()
            {
                TenantId = viewModel.TenantId,
                Status = viewModel.Status,
                CustomerId = viewModel.CustomerId,
                CustomerAddress = viewModel.CustomerAddress,
                CustomerEmail = viewModel.CustomerEmail,
                InvoiceTermsId = viewModel.InvoiceTermsId,
                IssueDate = viewModel.IssueDate,
                DueDate = viewModel.DueDate,
                Message = viewModel.Message,
                CreatedById = contextUserId,
                LineItems = viewModel.LineItems
                    ?.Select(li => InvoiceLineItemRequestViewModel.ToModel(li, contextUserId))
                    ?.ToArray()
                    ?? Array.Empty<InvoiceLineItem>()
            };
        }
    }
}
