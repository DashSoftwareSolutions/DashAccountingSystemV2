using System;
using Newtonsoft.Json;
using DashAccountingSystemV2.Models;
using DashAccountingSystemV2.ViewModels.Serialization;

namespace DashAccountingSystemV2.ViewModels
{
    public class InvoiceLineItemResponseViewModel
    {
        public Guid Id { get; set; }

        public ushort OrderNumber { get; set; }

        [JsonConverter(typeof(JsonDateConverter))]
        public DateTime Date { get; set; }

        public Guid ProductId { get; set; }

        public string ProductOrService { get; set; }

        public string ProductCategory { get; set; }

        public string Description { get; set; }

        public decimal Quantity { get; set; }

        public AmountViewModel UnitPrice { get; set; }

        public AmountViewModel Total { get; set; }

        public Guid? TimeActivityId { get; set; }

        public static InvoiceLineItemResponseViewModel FromModel(InvoiceLineItem model)
        {
            if (model == null)
                return null;

            return new InvoiceLineItemResponseViewModel()
            {
                Id = model.Id,
                OrderNumber = model.OrderNumber,
                Date = model.Date,
                ProductId = model.ProductId,
                ProductCategory = model.ProductOrService?.Category?.Name,
                ProductOrService = model.ProductOrService?.Name,
                Description = model.Description,
                Quantity = model.Quantity,
                UnitPrice = new AmountViewModel(model.UnitPrice, model.AssetType),
                Total = new AmountViewModel(model.Total, model.AssetType),
                TimeActivityId = model.TimeActivityId,
            };
        }
    }
}
