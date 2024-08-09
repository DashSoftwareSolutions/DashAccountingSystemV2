namespace DashAccountingSystemV2.BackEnd.ViewModels
{
    public class BootstrapResponseViewModel
    {
        public string ApplicationVersion { get; set; }

        public ApplicationUserLiteViewModel UserInfo { get; set; }

        public IEnumerable<TenantViewModel> Tenants { get; set; }
    }
}
