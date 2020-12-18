using System;
using System.Security.Claims;

namespace DashAccountingSystemV2.Extensions
{
    public static class ClaimsPrincipalExtensions
    {
        public static string GetUserFirstName(this ClaimsPrincipal user)
        {
            return user.FindFirstValue(ClaimTypes.GivenName);
        }

        public static string GetUserFullName(this ClaimsPrincipal user)
        {
            return $"{user.GetUserFirstName()} {user.GetUserLastName()}".Trim();
        }

        public static Guid GetUserId(this ClaimsPrincipal user)
        {
            var nameIdentifierClaim = user.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrWhiteSpace(nameIdentifierClaim))
                throw new ArgumentException("Could not find the 'name identifier' claim");

            Guid userId;

            if (!Guid.TryParse(nameIdentifierClaim, out userId))
                throw new ArgumentException(
                    $"'name identifier' claim does not seem to be a GUID type value as expected; value is: '{nameIdentifierClaim}'");

            return userId;
        }

        public static string GetUserLastName(this ClaimsPrincipal user)
        {
            return user.FindFirstValue(ClaimTypes.Surname);
        }
    }
}
