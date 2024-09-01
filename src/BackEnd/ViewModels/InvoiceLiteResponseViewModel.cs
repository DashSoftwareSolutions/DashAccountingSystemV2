using System.Text.Json.Serialization;
using DashAccountingSystemV2.BackEnd.Models;
using DashAccountingSystemV2.BackEnd.ViewModels.Serialization;

namespace DashAccountingSystemV2.BackEnd.ViewModels
{
    public class InvoiceLiteResponseViewModel
    {
        public Guid Id { get; set; }

        public uint InvoiceNumber { get; set; }

        public string CustomerName { get; set; }

        public AmountViewModel Amount { get; set; }

        [JsonConverter(typeof(JsonDateConverter))]
        public DateTime IssueDate { get; set; }

        [JsonConverter(typeof(JsonDateConverter))]
        public DateTime DueDate { get; set; }

        public string Terms { get; set; }

        [JsonConverter(typeof(JsonStringEnumConverter<InvoiceStatus>))]
        public InvoiceStatus Status { get; set; }

        public static InvoiceLiteResponseViewModel FromModel(Invoice model)
        {
            if (model == null)
                return null;

            return new InvoiceLiteResponseViewModel()
            {
                Id = model.Id,
                InvoiceNumber = model.InvoiceNumber,
                CustomerName = model.Customer?.DisplayName,
                Amount = new AmountViewModel(model.Total, model.Tenant?.DefaultAssetType),
                IssueDate = model.IssueDate,
                DueDate = model.DueDate,
                Terms = model.InvoiceTerms?.Name,
                Status = model.Status,
            };
        }
    }
}
