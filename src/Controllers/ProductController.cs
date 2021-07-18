using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using DashAccountingSystemV2.BusinessLogic;
using DashAccountingSystemV2.Extensions;
using DashAccountingSystemV2.ViewModels;

namespace DashAccountingSystemV2.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/sales")]
    public class ProductController : Controller
    {
        private readonly IProductBusinessLogic _productBusinessLogic;

        public ProductController(IProductBusinessLogic productBusinessLogic)
        {
            _productBusinessLogic = productBusinessLogic;
        }

        [HttpGet("{tenantId:guid}/products")]
        public Task<IActionResult> GetCustomers([FromRoute] Guid tenantId)
        {
            var bizLogcResponse = _productBusinessLogic.GetByTenant(tenantId);
            return this.Result(bizLogcResponse, ProductLiteResponseViewModel.FromModel);
        }
    }
}
