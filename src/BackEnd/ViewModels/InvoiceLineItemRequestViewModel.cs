using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using DashAccountingSystemV2.BackEnd.Models;
using DashAccountingSystemV2.BackEnd.ViewModels.Serialization;

namespace DashAccountingSystemV2.BackEnd.ViewModels
{
    public class InvoiceLineItemRequestViewModel
    {
        public Guid? Id { get; set; }

        [Required(ErrorMessage = "Order Number is required.")]
        public ushort OrderNumber { get; set; }

        [DataType(DataType.Date)]
        [Required(ErrorMessage = "Date is required.")]
        [JsonConverter(typeof(JsonDateConverter))]
        public DateTime Date { get; set; }

        [Required(ErrorMessage = "Product ID is required.")]
        public Guid ProductId { get; set; }

        [Required(AllowEmptyStrings = false, ErrorMessage = "Description is required.")]
        [MaxLength(2048, ErrorMessage = "Description cannot exceed 2048 characters in length.")]
        public string Description { get; set; }

        [Required(ErrorMessage = "Quantity is required.")]
        public decimal Quantity { get; set; }

        [Required(ErrorMessage = "Unit Price is required.")]
        public AmountViewModel UnitPrice { get; set; }

        public Guid? TimeActivityId { get; set; }

        public static InvoiceLineItem ToModel(InvoiceLineItemRequestViewModel viewModel, Guid contextUserId)
        {
            if (viewModel == null)
                return null;

            var unitPrice = viewModel.UnitPrice.Amount ?? 0.0m;

            return new InvoiceLineItem()
            {
                Id = viewModel.Id ?? default(Guid),
                OrderNumber = viewModel.OrderNumber,
                Date = viewModel.Date,
                ProductId = viewModel.ProductId,
                Description = viewModel.Description,
                Quantity = viewModel.Quantity,
                UnitPrice = unitPrice,
                Total = viewModel.Quantity * unitPrice,
                AssetTypeId = viewModel.UnitPrice.AssetType.Id,
                CreatedById = contextUserId,
                TimeActivities = viewModel.TimeActivityId.HasValue ?
                    new InvoiceLineItemTimeActivity[]
                    {
                        new InvoiceLineItemTimeActivity()
                        {
                            TimeActivityId = viewModel.TimeActivityId.Value,
                        },
                    } :
                    Array.Empty<InvoiceLineItemTimeActivity>(),
            };
        }
    }
}
