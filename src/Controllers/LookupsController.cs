﻿using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
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

        public LookupsController(ISharedLookupRepository sharedLookupRepository)
        {
            _sharedLookupRepository = sharedLookupRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetLookups()
        {
            var accountTypes = await _sharedLookupRepository.GetAccountTypesAsync();
            var accountSubTypes = await _sharedLookupRepository.GetAccountSubTypesAsync();
            var assetTypes = await _sharedLookupRepository.GetAssetTypesAsync();

            var result = new LookupsViewModel()
            {
                AccountTypes = accountTypes.Select(at => new LookupValueViewModel(at.Id, at.Name)),
                AccountSubTypes = accountSubTypes.Select(AccountSubTypeViewModel.FromModel),
                AssetTypes = assetTypes.Select(ExtendedAssetTypeViewModel.FromModel),
            };

            return Json(result);
        }
    }
}
