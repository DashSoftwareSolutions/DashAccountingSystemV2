using System;
using System.Security.Cryptography;
using System.Threading.Tasks;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Extensions.Logging;
using DashAccountingSystemV2.Extensions;
using DashAccountingSystemV2.Services.Caching;
using DashAccountingSystemV2.Services.Export;
using DashAccountingSystemV2.Services.Time;

namespace DashAccountingSystemV2.Security.ExportDownloads
{
    public class ExportDownloadSecurityTokenService : IExportDownloadSecurityTokenService
    {
        private const string CacheKeyPrefix = "ExportDownloadToken";

        private readonly IExtendedDistributedCache _cache = null;
        private readonly ITimeProvider _timeProvider = null;
        private readonly ILogger _logger = null;

        public ExportDownloadSecurityTokenService(
            IExtendedDistributedCache cache,
            ITimeProvider timeProvider,
            ILogger<ExportDownloadSecurityTokenService> logger)
        {
            _cache = cache;
            _timeProvider = timeProvider;
            _logger = logger;
        }

        public async Task<string> RequestExportDownloadToken(
            Guid tenantId,
            Guid userId,
            ExportType exportType)
        {
            var requestTimestamp = _timeProvider.UtcNow.ToUnixTimestamp(milliseconds: true);
            var saltBytes = new byte[22];

            using (var cryptoRNG = RandomNumberGenerator.Create())
            {
                cryptoRNG.GetBytes(saltBytes);
            }

            var tokenPayloadBytes = new byte[64];
            
            Buffer.BlockCopy(saltBytes, 0, tokenPayloadBytes, 0, 11);
            Buffer.BlockCopy(tenantId.ToByteArray(), 0, tokenPayloadBytes, 11, 16);
            Buffer.BlockCopy(userId.ToByteArray(), 0, tokenPayloadBytes, 27, 16);
            Buffer.BlockCopy(BitConverter.GetBytes((ushort)exportType), 0, tokenPayloadBytes, 43, 2);
            Buffer.BlockCopy(BitConverter.GetBytes(requestTimestamp), 0, tokenPayloadBytes, 45, 8);
            Buffer.BlockCopy(saltBytes, 11, tokenPayloadBytes, 53, 11);

            byte[] tokenSignature = null;

            using (var hmac = new HMACSHA512(saltBytes))
            {
                tokenSignature = hmac.ComputeHash(tokenPayloadBytes);
            }

            var encodedTokenSignature = WebEncoders.Base64UrlEncode(tokenSignature);

            var cacheKey = $"{CacheKeyPrefix}_{encodedTokenSignature}";

            await _cache.SetAsync(cacheKey, tokenPayloadBytes, TimeSpan.FromMinutes(5));

            return encodedTokenSignature;
        }

        public async Task<ExportDownloadAuthenticationTicket> RedeemExportDownloadToken(string token)
        {
            var cacheKey = $"{CacheKeyPrefix}_{token}";
            var recoveredTokenPayloadBytes = await _cache.GetAsync(cacheKey);

            if (recoveredTokenPayloadBytes == null)
            {
                _logger.LogWarning("Token not found");
                return null;
            }

            Guid tenantId;
            Guid userId;
            ExportType exportType;

            var isTokenValid = TryDecomposeToken(
                recoveredTokenPayloadBytes,
                out tenantId,
                out userId,
                out exportType,
                out _,
                out _);

            if (!isTokenValid)
            {
                _logger.LogWarning("Token validation failed");
                return null;
            }

            return new ExportDownloadAuthenticationTicket()
            {
                TenantId = tenantId,
                UserId = userId,
                ExportType = exportType,
            };
        }

        internal bool TryDecomposeToken(
            byte[] completeTokenPayload,
            out Guid tenantId,
            out Guid userId,
            out ExportType exportType,
            out long requstTimestamp,
            out byte[] salt)
        {
            tenantId = Guid.Empty;
            userId = Guid.Empty;
            exportType = ExportType.Unknown;
            requstTimestamp = long.MinValue;
            salt = new byte[22];

            var tenantIdBytes = new byte[16];
            var userIdBytes = new byte[16];
            var exportTypeBytes = new byte[8];
            var requstTimestampBytes = new byte[8];

            if (completeTokenPayload.Length != 64)
            {
                _logger.LogWarning("Token payload was of unexpected length");
                return false;
            }

            try
            {
                Buffer.BlockCopy(completeTokenPayload, 0, salt, 0, 11);
                Buffer.BlockCopy(completeTokenPayload, 11, tenantIdBytes, 0, 16);
                Buffer.BlockCopy(completeTokenPayload, 27, userIdBytes, 0, 16);
                Buffer.BlockCopy(completeTokenPayload, 43, exportTypeBytes, 0, 2);
                Buffer.BlockCopy(completeTokenPayload, 45, requstTimestampBytes, 0, 8);
                Buffer.BlockCopy(completeTokenPayload, 53, salt, 11, 11);

                tenantId = new Guid(tenantIdBytes);
                userId = new Guid(userIdBytes);

                var maybeExportType = EnumerationExtensions.GetEnum<ExportType>(BitConverter.ToUInt16(exportTypeBytes));

                if (maybeExportType.HasValue)
                    exportType = maybeExportType.Value;

                requstTimestamp = BitConverter.ToInt64(requstTimestampBytes);

                return maybeExportType.HasValue && exportType != ExportType.Unknown;
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Token validation and request context extraction failed");
                return false;
            }
        }
    }
}
