namespace DashAccountingSystemV2.Security
{
    public static class Constants
    {
        public const string ExportDownloadAuthenticationScheme = "One-time use export download token";

        public const string ExportDownloadAuthorizationPolicy = "Authorization via Export Download Token";

        public static class DashClaimTypes
        {
            public const string ExportType = "urn:dash-software:dash-accounting:export-type";

            public const string TenantId = "urn:dash-software:dash-accounting:tenant-id";
        }
    }
}
