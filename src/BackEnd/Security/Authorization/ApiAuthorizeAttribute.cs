using System.Diagnostics;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authorization.Policy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Http.Extensions;

namespace DashAccountingSystemV2.BackEnd.Security.Authorization
{
    public class ApiAuthorizeAttribute : ActionFilterAttribute, IAsyncAuthorizationFilter
    {
        public AuthorizationPolicy Policy { get; }

        public ApiAuthorizeAttribute(string? requiredAuthenticationScheme = null)
        {
            Policy = string.IsNullOrEmpty(requiredAuthenticationScheme)
                ? new AuthorizationPolicyBuilder().RequireAuthenticatedUser().Build()
                : new AuthorizationPolicyBuilder()
                    .AddAuthenticationSchemes(requiredAuthenticationScheme!)
                    .RequireAuthenticatedUser()
                    .Build();
        }

        public async Task OnAuthorizationAsync(AuthorizationFilterContext context)
        {
            ArgumentNullException.ThrowIfNull(context);

            // Allow Anonymous skips all authorization
            if (context.Filters.Any(item => item is IAllowAnonymousFilter))
            {
                return;
            }

            var policyEvaluator = context.HttpContext.RequestServices.GetRequiredService<IPolicyEvaluator>();
            var authenticateResult = await policyEvaluator.AuthenticateAsync(Policy, context.HttpContext);
            var authorizeResult = await policyEvaluator.AuthorizeAsync(Policy, authenticateResult, context.HttpContext, context);

            if (authorizeResult.Challenged)
            {
                var problem = new ProblemDetails()
                {
                    Type = "https://tools.ietf.org/html/rfc9110#section-15.5.2",
                    Title = "Unauthorized",
                    Status = StatusCodes.Status401Unauthorized,
                    Detail = "This request must include a valid export download token.  Either there was no token, it it was invalid (perhaps expired).",
                    Instance = context.HttpContext.Request.GetEncodedPathAndQuery(),
                };

                problem.Extensions["traceId"] = Activity.Current?.Id ?? context.HttpContext?.TraceIdentifier;

                context.Result = new UnauthorizedObjectResult(problem);
            }
        }
    }
}
