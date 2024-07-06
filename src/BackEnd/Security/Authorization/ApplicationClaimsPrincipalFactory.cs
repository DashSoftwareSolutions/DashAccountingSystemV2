using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using System.Security.Claims;
using DashAccountingSystemV2.BackEnd.Models;

namespace DashAccountingSystemV2.BackEnd.Security.Authorization
{
    public class ApplicationClaimsPrincipalFactory : UserClaimsPrincipalFactory<ApplicationUser, ApplicationRole>
    {
        public ApplicationClaimsPrincipalFactory(
            UserManager<ApplicationUser> userManager,
            RoleManager<ApplicationRole> roleManager,
            IOptions<IdentityOptions> optionsAccessor)
            : base(userManager, roleManager, optionsAccessor)
        {
        }

        public async override Task<ClaimsPrincipal> CreateAsync(ApplicationUser user)
        {
            var principal = await base.CreateAsync(user);
            var identity = principal.Identity as ClaimsIdentity;

            if (identity == null)
                return principal;

            var claims = new List<Claim>();

            var hasFirstName = !string.IsNullOrWhiteSpace(user.FirstName);
            var hasLastName = !string.IsNullOrWhiteSpace(user.LastName);

            if (hasFirstName)
                claims.Add(new Claim(ClaimTypes.GivenName, user.FirstName!));

            if (hasLastName)
                claims.Add(new Claim(ClaimTypes.Surname, user.LastName!));

            identity.AddClaims(claims);

            if (hasFirstName && hasLastName)
            {
                var existingNameClaim = identity.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Name);

                if (existingNameClaim != null)
                    identity.RemoveClaim(existingNameClaim);

                identity.AddClaim(new Claim(ClaimTypes.Name, $"{user.FirstName} {user.LastName}"));
            }

            return principal;
        }
    }
}
