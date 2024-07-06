using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using DashAccountingSystemV2.BackEnd.Data;
using DashAccountingSystemV2.BackEnd.Models;

namespace DashAccountingSystemV2.BackEnd.Repositories
{
    public class ProductRepository : IProductRepository
    {
        private readonly ApplicationDbContext _db = null;

        public ProductRepository(ApplicationDbContext applicationDbContext)
        {
            _db = applicationDbContext;
        }

        public async Task<IEnumerable<ProductCategory>> GetCategoriesAsync(Guid tenantId)
        {
            return await _db.ProductCategory
                .Where(pc => pc.TenantId == tenantId)
                .OrderBy(pc => pc.Name)
                .ToListAsync();
        }

        public async Task<IEnumerable<Product>> GetProductsAsync(Guid tenantId)
        {
            return await _db.Product
                .Where(p => p.TenantId == tenantId)
                .Include(p => p.Category)
                .OrderBy(p => p.Name)
                .ToListAsync();
        }

        public async Task<ProductCategory> InsertCategory(ProductCategory category)
        {
            await _db.AddAsync(category);
            await _db.SaveChangesAsync();
            return await _db.ProductCategory.FirstOrDefaultAsync(pc => pc.Id == category.Id);
        }

        public async Task<Product> InsertProduct(Product product)
        {
            await _db.AddAsync(product);
            await _db.SaveChangesAsync();

            return await _db.Product
                .Where(p => p.Id == product.Id)
                .Include(p => p.Category)
                .Include(p => p.RevenueAccount)
                .FirstOrDefaultAsync();
        }
    }
}
