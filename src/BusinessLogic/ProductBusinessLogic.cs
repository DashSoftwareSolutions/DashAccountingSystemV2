using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using DashAccountingSystemV2.Models;
using DashAccountingSystemV2.Repositories;

namespace DashAccountingSystemV2.BusinessLogic
{
    public class ProductBusinessLogic : IProductBusinessLogic
    {
        private readonly IProductRepository _productRepository = null;
        private readonly ITenantRepository _tenantRepository = null;

        public ProductBusinessLogic(
            IProductRepository productRepository,
            ITenantRepository tenantRepository)
        {
            _productRepository = productRepository;
            _tenantRepository = tenantRepository;
        }

        public async Task<BusinessLogicResponse<IEnumerable<Product>>> GetByTenant(Guid tenantId)
        {
            var tenant = await _tenantRepository.GetTenantAsync(tenantId);

            if (tenant == null)
            {
                return new BusinessLogicResponse<IEnumerable<Product>>(ErrorType.RequestedEntityNotFound, "Tenant not found");
            }

            // TODO: Verify access to tenant and permission for listing products

            var products = await _productRepository.GetProductsAsync(tenantId);

            return new BusinessLogicResponse<IEnumerable<Product>>(products);
        }
    }
}
