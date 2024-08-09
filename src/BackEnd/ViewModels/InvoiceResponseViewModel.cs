using System.Text.Json.Serialization;
using DashAccountingSystemV2.BackEnd.Models;
using DashAccountingSystemV2.BackEnd.ViewModels.Serialization;

namespace DashAccountingSystemV2.BackEnd.ViewModels
{
    public class InvoiceResponseViewModel
    {
        public Guid Id { get; set; }

        public Guid TenantId { get; set; }

        public uint InvoiceNumber { get; set; }

        [JsonConverter(typeof(JsonStringEnumConverter<InvoiceStatus>))]
        public InvoiceStatus Status { get; set; }

        public Guid CustomerId { get; set; }

        public CustomerLiteResponseViewModel Customer { get; set; }

        public string CustomerEmail { get; set; }

        public string CustomerAddress { get; set; }

        public Guid InvoiceTermsId { get; set; }

        public InvoiceTermsViewModel InvoiceTerms { get; set; }

        [JsonConverter(typeof(JsonDateConverter))]
        public DateTime IssueDate { get; set; }

        [JsonConverter(typeof(JsonDateConverter))]
        public DateTime DueDate { get; set; }

        public AmountViewModel Amount { get; set; }

        public string Message { get; set; }

        public IEnumerable<InvoiceLineItemResponseViewModel> LineItems { get; set; }

        public static InvoiceResponseViewModel FromModel(Invoice model)
        {
            if (model == null)
                return null;

            return new InvoiceResponseViewModel()
            {
                Id = model.Id,
                TenantId = model.TenantId,
                InvoiceNumber = model.InvoiceNumber,
                Status = model.Status,
                CustomerId = model.CustomerId,
                Customer = CustomerLiteResponseViewModel.FromModel(model.Customer),
                CustomerAddress = model.CustomerAddress,
                CustomerEmail = model.CustomerEmail,
                InvoiceTermsId = model.InvoiceTermsId,
                InvoiceTerms = InvoiceTermsViewModel.FromModel(model.InvoiceTerms),
                IssueDate = model.IssueDate,
                DueDate = model.DueDate,
                Amount = new AmountViewModel(model.Total, model.Tenant.DefaultAssetType),
                Message = model.Message,
                LineItems = model.LineItems.Select(InvoiceLineItemResponseViewModel.FromModel),
            };
        }
    }
}
