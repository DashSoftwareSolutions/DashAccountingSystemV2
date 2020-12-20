using System;
using System.Collections.Generic;
using System.Security.Claims;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using DashAccountingSystemV2.Models;
using DashAccountingSystemV2.Extensions;
using System.Threading.Tasks;

namespace DashAccountingSystemV2.Security.Authentication
{
    public class ApplicationUserManager : UserManager<ApplicationUser>
    {
        public ApplicationUserManager(IUserStore<ApplicationUser> store,
                                     IOptions<IdentityOptions> optionsAccessor,
                                     IPasswordHasher<ApplicationUser> passwordHasher,
                                     IEnumerable<IUserValidator<ApplicationUser>> userValidators,
                                     IEnumerable<IPasswordValidator<ApplicationUser>> passwordValidators,
                                     ILookupNormalizer keyNormalizer,
                                     IdentityErrorDescriber errors,
                                     IServiceProvider services,
                                     ILogger<UserManager<ApplicationUser>> logger)
            : base(store, optionsAccessor, passwordHasher, userValidators, passwordValidators, keyNormalizer, errors, services, logger)
        {
        }

        public string GetUserFirstName(ClaimsPrincipal user)
        {
            return user?.GetUserFirstName();
        }

        public string GetUserFullName(ClaimsPrincipal user)
        {
            return user?.GetUserFullName();
        }

        public string GetUserLastName(ClaimsPrincipal user)
        {
            return user?.GetUserLastName();
        }

        public override async Task<IdentityResult> ConfirmEmailAsync(ApplicationUser user, string token)
        {
            var result = await base.ConfirmEmailAsync(user, token);

            if (result.Succeeded)
            {
                var retrievedUser = await Store.FindByIdAsync(user.Id.ToString(), CancellationToken);

                if (retrievedUser != null)
                {
                    retrievedUser.EmailConfirmedDate = DateTime.UtcNow;
                    await Store.UpdateAsync(retrievedUser, CancellationToken);
                }
            }

            return result;
        }
    }
}
