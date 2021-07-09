using System.Collections.Generic;

namespace DashAccountingSystemV2.ViewModels
{
    public class LookupsViewModel
    {
        public IEnumerable<LookupValueViewModel> AccountTypes { get; set; }
        public IEnumerable<LookupValueViewModel> AccountSubTypes { get; set; }
        public IEnumerable<ExtendedAssetTypeViewModel> AssetTypes { get; set; }
    }
}
