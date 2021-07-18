using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using DashAccountingSystemV2.BusinessLogic;
using DashAccountingSystemV2.Extensions;
using TimeZone = DashAccountingSystemV2.Models.TimeZone;

namespace DashAccountingSystemV2.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/time-zones")]
    public class TimeZoneController : Controller
    {
        private readonly ITimeZoneBusinessLogic _timeZoneBusinessLogic = null;

        public TimeZoneController(ITimeZoneBusinessLogic timeZoneBusinessLogic)
        {
            _timeZoneBusinessLogic = timeZoneBusinessLogic;
        }

        [HttpGet]
        public Task<IActionResult> GetTimeZones()
        {
            var bizLogicResult = _timeZoneBusinessLogic.GetTimeZones();
            return this.Result(bizLogicResult, (TimeZone tz) => tz);
        }
    }
}
