using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DashAccountingSystemV2.BackEnd.Models;

namespace DashAccountingSystemV2.BackEnd.Repositories
{
    public interface IProductRepository
    {
        Task<IEnumerable<ProductCategory>> GetCategoriesAsync(Guid tenantId);

        Task<IEnumerable<Product>> GetProductsAsync(Guid tenantId);

        Task<ProductCategory> InsertCategory(ProductCategory category);

        Task<Product> InsertProduct(Product product);
    }
}
