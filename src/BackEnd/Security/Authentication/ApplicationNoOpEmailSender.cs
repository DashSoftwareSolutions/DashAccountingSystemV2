using Microsoft.AspNetCore.Identity;
using DashAccountingSystemV2.BackEnd.Models;

namespace DashAccountingSystemV2.BackEnd.Security.Authentication
{
    public class ApplicationNoOpEmailSender(ILogger<ApplicationNoOpEmailSender> logger) : IEmailSender<ApplicationUser>
    {
        private readonly ILogger _logger = logger;

        public Task SendConfirmationLinkAsync(ApplicationUser user, string email, string confirmationLink)
        {
            _logger.LogInformation(
                "Sending confirmation link {confirmationLink} to email address {email} for user ID {userId} {fullName} ...",
                confirmationLink,
                email,
                user.Id,
                $"{user.FirstName} {user.LastName}");

            return Task.CompletedTask;
        }

        public Task SendPasswordResetCodeAsync(ApplicationUser user, string email, string resetCode)
        {
            _logger.LogInformation(
                "Sending password reset code {resetCode} to email address {email} for user ID {userId} {fullName} ...",
                resetCode,
                email,
                user.Id,
                $"{user.FirstName} {user.LastName}");

            return Task.CompletedTask;
        }

        public Task SendPasswordResetLinkAsync(ApplicationUser user, string email, string resetLink)
        {
            _logger.LogInformation(
                "Sending password reset link {resetLink} to email address {email} for user ID {userId} {fullName} ...",
                resetLink,
                email,
                user.Id,
                $"{user.FirstName} {user.LastName}");

            return Task.CompletedTask;
        }
    }
}
