using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DashAccountingSystemV2.BackEnd.Controllers
{
    /// <summary>
    /// Controller for testing API error responses of various kinds
    /// </summary>
    [ApiController]
    [AllowAnonymous]
    [Route("api/test-errors")]
    public class TestErrorsController : ControllerBase
    {
        /// <summary>
        /// Throws an exception to test global error handling.
        /// </summary>
        /// <exception cref="HealthyChurchApplicationException"></exception>
        [HttpGet("throws-exception")]
        public IActionResult TestRuntimeException([FromQuery] string? foo = null)
        {
            throw new InvalidOperationException("Something went wrong!");
        }
    }
}
