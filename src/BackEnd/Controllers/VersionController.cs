using System.Reflection;
using Microsoft.AspNetCore.Mvc;

namespace DashAccountingSystemV2.BackEnd.Controllers
{
    [ApiController]
    [Route("api/application-version")]
    public class VersionController : ControllerBase
    {
        [HttpGet]
        public Task<IActionResult> GetApplicationVersion()
            => Task.FromResult<IActionResult>(
                Ok(
                    new
                    {
                        Version = Assembly.GetEntryAssembly()?.GetCustomAttribute<AssemblyInformationalVersionAttribute>()?.InformationalVersion
                    }));
    }
}
