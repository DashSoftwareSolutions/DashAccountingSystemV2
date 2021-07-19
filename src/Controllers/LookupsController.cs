using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using DashAccountingSystemV2.BusinessLogic;
using DashAccountingSystemV2.Extensions;
using DashAccountingSystemV2.Repositories;
using DashAccountingSystemV2.ViewModels;

namespace DashAccountingSystemV2.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/lookups")]
    public class LookupsController : Controller
    {
        private readonly ISharedLookupRepository _sharedLookupRepository = null;
        private readonly ITimeZoneBusinessLogic _timeZoneBusinessLogic = null;

        public LookupsController(
            ISharedLookupRepository sharedLookupRepository,
            ITimeZoneBusinessLogic timeActivityBusinessLogic)
        {
            _sharedLookupRepository = sharedLookupRepository;
            _timeZoneBusinessLogic = timeActivityBusinessLogic;
        }

        [HttpGet]
        public async Task<IActionResult> GetLookups()
        {
            var accountTypes = await _sharedLookupRepository.GetAccountTypesAsync();
            var accountSubTypes = await _sharedLookupRepository.GetAccountSubTypesAsync();
            var assetTypes = await _sharedLookupRepository.GetAssetTypesAsync();
            var timeZonesBizLogResponse = await _timeZoneBusinessLogic.GetTimeZones();

            if (!timeZonesBizLogResponse.IsSuccessful)
                return this.ErrorResponse(timeZonesBizLogResponse);

            var result = new LookupsViewModel()
            {
                AccountTypes = accountTypes.Select(at => new LookupValueViewModel(at.Id, at.Name)),
                AccountSubTypes = accountSubTypes.Select(AccountSubTypeViewModel.FromModel),
                AssetTypes = assetTypes.Select(ExtendedAssetTypeViewModel.FromModel),
                TimeZones = timeZonesBizLogResponse.Data,
            };

            return Json(result);
        }
    }
}
