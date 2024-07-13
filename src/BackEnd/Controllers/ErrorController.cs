using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;

namespace DashAccountingSystemV2.BackEnd.Controllers
{
    /// <summary>
    /// Global error handler
    /// </summary>
    [AllowAnonymous]
    [ApiExplorerSettings(IgnoreApi = true)]
    public class ErrorController : ControllerBase
    {
        /// <summary>
        /// Global Error handler
        /// </summary>
        /// <remarks>
        /// Error responses <b><i>MUST NOT</i></b> contain any sensitive information like exception types or stack traces!
        /// </remarks>
        /// <returns>
        /// 500 Internal Server Error response with an <see href="https://tools.ietf.org/html/rfc7807">RFC 7807 Problem Details</see>
        /// JSON object in the response body.
        /// </returns>
        [Route("/api/error")]
        public IActionResult HandleError()
        {
            var exceptionHandlerPathFeature = HttpContext.Features.Get<IExceptionHandlerPathFeature>()!;

            return Problem(
                title: "Error",
                detail: "An error occurred while processing your request.",
                instance: exceptionHandlerPathFeature.Path);
        }
    }
}
