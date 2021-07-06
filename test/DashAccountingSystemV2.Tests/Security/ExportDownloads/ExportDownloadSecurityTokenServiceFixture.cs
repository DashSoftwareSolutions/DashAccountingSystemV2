using System;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Xunit;
using DashAccountingSystemV2.Security.ExportDownloads;
using DashAccountingSystemV2.Services.Export;
using DashAccountingSystemV2.Services.Time;
using DashAccountingSystemV2.Tests.Fakes;

namespace DashAccountingSystemV2.Tests.Security.ExportDownloads
{
    public class ExportDownloadSecurityTokenServiceFixture
    {
        [Fact]
        public async Task Can_Request_And_Redeem_Export_Download_Security_Token()
        {
            var securityTokenService = GetSecurityTokenService();
            var tenantId = Guid.NewGuid();
            var userId = Guid.NewGuid();
            var exportType = ExportType.BalanceSheetReport;

            var exportSecurityToken = await securityTokenService.RequestExportDownloadToken(tenantId, userId, exportType);

            var exportDownloadAuthenticationTicket = await securityTokenService.RedeemExportDownloadToken(exportSecurityToken);

            AssertDownloadAuthenticationTicket(tenantId, userId, exportType, exportDownloadAuthenticationTicket);
        }

        private void AssertDownloadAuthenticationTicket(
            Guid expectedTenantId,
            Guid expectedUserId,
            ExportType expectedExportType,
            ExportDownloadAuthenticationTicket actualTicket)
        {
            Assert.NotNull(actualTicket);
            Assert.Equal(expectedTenantId, actualTicket.TenantId);
            Assert.Equal(expectedUserId, actualTicket.UserId);
            Assert.Equal(expectedExportType, actualTicket.ExportType);
        }

        private ExportDownloadSecurityTokenService GetSecurityTokenService()
        {
            var fakeCache = new FakeCache();
            var timeProvider = new TimeProvider();
            var loggerFactory = TestUtilities.GetLoggerFactory();
            
            return new ExportDownloadSecurityTokenService(
                fakeCache,
                timeProvider,
                loggerFactory.CreateLogger<ExportDownloadSecurityTokenService>());
        }
    }
}
