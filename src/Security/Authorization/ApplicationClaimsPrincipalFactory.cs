using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using IdentityModel;
using DashAccountingSystemV2.Models;

namespace DashAccountingSystemV2.Security.Authorization
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
            var identity = (ClaimsIdentity)principal.Identity;
            
            var claims = new List<Claim>();

            var hasFirstName = !string.IsNullOrWhiteSpace(user.FirstName);
            var hasLastName = !string.IsNullOrWhiteSpace(user.LastName);

            if (hasFirstName)
                claims.Add(new Claim(JwtClaimTypes.GivenName, user.FirstName));

            if (hasLastName)
                claims.Add(new Claim(JwtClaimTypes.FamilyName, user.LastName));

            if (hasFirstName && hasLastName)
                claims.Add(new Claim(JwtClaimTypes.Name, $"{user.FirstName} {user.LastName}"));

            identity.AddClaims(claims);

            return principal;
        }
    }
}
