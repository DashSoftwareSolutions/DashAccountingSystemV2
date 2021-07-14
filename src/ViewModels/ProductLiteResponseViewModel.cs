using System;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using DashAccountingSystemV2.Models;

namespace DashAccountingSystemV2.ViewModels
{
    public class ProductLiteResponseViewModel
    {
        public Guid Id { get; set; }

        public Guid CategoryId { get; set; }

        public string Category { get; set; }

        [JsonConverter(typeof(StringEnumConverter))]
        public ProductType Type { get; set; }

        public string SKU { get; set; }

        public string Name { get; set; }

        public decimal? SalesPriceOrRate { get; set; }

        public static ProductLiteResponseViewModel FromModel(Product product)
        {
            if (product == null)
                return null;

            return new ProductLiteResponseViewModel()
            {
                Id = product.Id,
                CategoryId = product.CategoryId,
                Category = product.Category?.Name,
                Type = product.Type,
                SKU = product.SKU,
                Name = product.Name,
                SalesPriceOrRate = product.SalesPriceOrRate,
            };
        }
    }
}
