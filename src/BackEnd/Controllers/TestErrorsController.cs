using System.ComponentModel.DataAnnotations;
using System.Diagnostics;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.Extensions;
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

        [HttpGet("problem-500")]
        public IActionResult TestInternalServerError()
        {
            return Problem(
                detail: "Some random API error occurred",
                instance: HttpContext.Request.GetEncodedPathAndQuery(),
                statusCode: StatusCodes.Status500InternalServerError,
                title: "Error");
        }

        /// <summary>
        /// Tests request view model validation via annotation attributes and framework generated response
        /// </summary>
        /// <param name="viewModel"><see cref="RequestViewModel"/></param>
        [HttpPost("request-validation")]
        public IActionResult TestValidation([FromBody] RequestViewModel viewModel)
        {
            return Ok(new { Message = "Successfully passed all of the validation." });
        }

        /// <summary>
        /// Always returns 400 Bad Request response as an <see href="https://tools.ietf.org/html/rfc7807">RFC 7807 Problem Details</see>
        /// JSON object with some custom extended properties.
        /// </summary>
        [HttpGet("problem-400")]
        public IActionResult TestCustomProblemResponse()
        {
            var status = StatusCodes.Status400BadRequest;

            var problem = new ProblemDetails()
            {
                Title = "Custom Problem",
                Detail = "This is a customized Problem response.  There was an issue with \'foo\' and \'bar\'; please fix it.",
                Instance = Request.GetEncodedPathAndQuery(),
                Status = status,
                Type = "https://tools.ietf.org/html/rfc9110#section-15.5.1",
            };

            problem.Extensions.Add("traceId", Activity.Current?.Id ?? HttpContext?.TraceIdentifier);
            problem.Extensions.Add("foo", "The problem with \'foo\' field is yadda yadda yadda ...");
            problem.Extensions.Add("bar", new { Quux = 123, Thud = "waldo" });

            return StatusCode(status, problem);
        }
    }

    /// <summary>
    /// Sample request view model to test validation
    /// </summary>
    public class RequestViewModel
    {
        /// <summary>
        /// First Name
        /// </summary>
        [Required(AllowEmptyStrings = false, ErrorMessage = "First name is required.")]
        [MaxLength(50, ErrorMessage = "First name cannot be longer than 50 characters.")]
        public string FirstName { get; set; }

        /// <summary>
        /// Last Name
        /// </summary>
        [Required(AllowEmptyStrings = false, ErrorMessage = "Last name is required.")]
        [MaxLength(50, ErrorMessage = "Last name cannot be longer than 50 characters.")]
        public string LastName { get; set; }

        /// <summary>
        /// Email
        /// </summary>
        [Required(AllowEmptyStrings = false, ErrorMessage = "Email is required.")]
        [MaxLength(256, ErrorMessage = "Email cannot be longer than 256 characters.")]
        [DataType(DataType.EmailAddress)]
        [RegularExpression(@"(?:[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*)@(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-zA-Z0-9-]*[a-zA-Z0-9]:(?:|\\)+)\])", ErrorMessage = "Email does not appear to be valid.")]
        public string Email { get; set; }

        /// <summary>
        /// Date of Birth
        /// </summary>
        [Required(AllowEmptyStrings = false, ErrorMessage = "Date of birth is required.")]
        [DataType(DataType.Date)]
        public DateOnly? DateOfBirth { get; set; }
    }
}
