using DashAccountingSystemV2.Models;

namespace DashAccountingSystemV2.ViewModels
{
    public class AssetTypeViewModel : LookupValueViewModel
    {
        public string? Symbol { get; set; }

        public AssetTypeViewModel() { }

        public AssetTypeViewModel(int id, string name, string? symbol = null)
            : base(id, name)
        {
            Symbol = symbol;
        }

        public static AssetTypeViewModel? FromModel(AssetType assetType)
        {
            if (assetType == null)
                return null;

            return new AssetTypeViewModel(
                assetType.Id,
                assetType.Name,
                assetType.Symbol);
        }

        public static AssetType? ToModel(AssetTypeViewModel viewModel)
        {
            if (viewModel == null)
                return null;

            return new AssetType(
                viewModel.Id,
                viewModel.Name,
                viewModel.Symbol);
        }
    }
}
