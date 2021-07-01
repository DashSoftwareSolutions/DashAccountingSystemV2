using System.Collections.Generic;

namespace DashAccountingSystemV2.ViewModels
{
    public class LookupsViewModel
    {
        public IEnumerable<LookupValueViewModel> AccountTypes { get; set; }
        public IEnumerable<AssetTypeViewModel> AssetTypes { get; set; }
    }
}
