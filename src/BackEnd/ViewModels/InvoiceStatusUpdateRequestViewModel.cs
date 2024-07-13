using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using DashAccountingSystemV2.BackEnd.Models;

namespace DashAccountingSystemV2.BackEnd.ViewModels
{
    public class InvoiceStatusUpdateRequestViewModel
    {
        [Required(ErrorMessage = "Tenant ID is required.")]
        public Guid TenantId { get; set; }

        [Required(ErrorMessage = "Invoice Number is required.")]
        public uint InvoiceNumber { get; set; }

        [Required(ErrorMessage = "Status is required.")]
        [JsonConverter(typeof(JsonStringEnumConverter<InvoiceStatus>))]
        public InvoiceStatus Status { get; set; }
    }
}
