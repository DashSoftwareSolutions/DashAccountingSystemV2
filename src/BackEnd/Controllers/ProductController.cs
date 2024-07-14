using Microsoft.AspNetCore.Mvc;
using DashAccountingSystemV2.BackEnd.BusinessLogic;
using DashAccountingSystemV2.BackEnd.Extensions;
using DashAccountingSystemV2.BackEnd.Security.Authorization;
using DashAccountingSystemV2.BackEnd.ViewModels;

namespace DashAccountingSystemV2.BackEnd.Controllers
{
    [ApiAuthorize]
    [ApiController]
    [Route("api/sales")]
    public class ProductController : ControllerBase
    {
        private readonly IProductBusinessLogic _productBusinessLogic;

        public ProductController(IProductBusinessLogic productBusinessLogic)
        {
            _productBusinessLogic = productBusinessLogic;
        }

        [HttpGet("{tenantId:guid}/products")]
        public Task<IActionResult> GetCustomers([FromRoute] Guid tenantId)
        {
            var bizLogicResponse = _productBusinessLogic.GetByTenant(tenantId);
            return this.Result(bizLogicResponse, ProductLiteResponseViewModel.FromModel);
        }
    }
}
