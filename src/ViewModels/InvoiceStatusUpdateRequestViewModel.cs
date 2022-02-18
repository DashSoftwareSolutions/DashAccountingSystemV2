using System;
using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using DashAccountingSystemV2.Models;

namespace DashAccountingSystemV2.ViewModels
{
    public class InvoiceStatusUpdateRequestViewModel
    {
        [Required(ErrorMessage = "Tenant ID is required.")]
        public Guid TenantId { get; set; }

        [Required(ErrorMessage = "Invoice Number is required.")]
        public uint InvoiceNumber { get; set; }

        [Required(ErrorMessage = "Status is required.")]
        [JsonConverter(typeof(StringEnumConverter))]
        public InvoiceStatus Status { get; set; }
    }
}
