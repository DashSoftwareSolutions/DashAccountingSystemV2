using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using DashAccountingSystemV2.Extensions;
using DashAccountingSystemV2.Models;
using DashAccountingSystemV2.Repositories;

namespace DashAccountingSystemV2.BusinessLogic
{
    public class TimeActivityBusinessLogic : ITimeActivityBusinessLogic
    {
        private readonly ITenantRepository _tenantRepository = null;
        private readonly ITimeActivityRepository _timeActivityRespository = null;
        private readonly ILogger _logger = null;

        public TimeActivityBusinessLogic(
            ITenantRepository tenantRepository,
            ITimeActivityRepository timeActivityRepository,
            ILogger<TimeActivityBusinessLogic> logger)
        {
            _tenantRepository = tenantRepository;
            _timeActivityRespository = timeActivityRepository;
            _logger = logger;
        }

        public async Task<BusinessLogicResponse<TimeActivity>> CreateTimeActivity(TimeActivity timeActivity)
        {
            if (timeActivity == null)
                throw new ArgumentNullException(nameof(timeActivity));

            var tenant = await _tenantRepository.GetTenantAsync(timeActivity.TenantId);

            if (tenant == null)
            {
                return new BusinessLogicResponse<TimeActivity>(ErrorType.RequestNotValid, "Tenant not found");
            }

            try
            {
                var savedTimeActivity = await _timeActivityRespository.InsertAsync(timeActivity);
                return new BusinessLogicResponse<TimeActivity>(savedTimeActivity);
            }
            catch (Exception ex)
            {
                // TODO: More specific error handling -- distinguish between 400 Bad Request (409 Conflict if applicable) and true 500 Internal Server Error
                _logger.LogError(ex, "Error creating new Time Activity");
                return new BusinessLogicResponse<TimeActivity>(ErrorType.RuntimeException, "Failed to create new Time Activity");
            }
        }
    }
}
