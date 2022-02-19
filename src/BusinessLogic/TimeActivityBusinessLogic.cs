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
        private readonly ICustomerRepository _customerRepository = null;
        private readonly IEmployeeRepository _employeeRepository = null;
        private readonly ITenantRepository _tenantRepository = null;
        private readonly ITimeActivityRepository _timeActivityRespository = null;
        private readonly ILogger _logger = null;

        public TimeActivityBusinessLogic(
            ICustomerRepository customerRepository,
            IEmployeeRepository employeeRepository,
            ITenantRepository tenantRepository,
            ITimeActivityRepository timeActivityRepository,
            ILogger<TimeActivityBusinessLogic> logger)
        {
            _customerRepository = customerRepository;
            _employeeRepository = employeeRepository;
            _tenantRepository = tenantRepository;
            _timeActivityRespository = timeActivityRepository;
            _logger = logger;
        }

        public async Task<BusinessLogicResponse<TimeActivityDetailsReportDto>> GetTimeActivitiesDetailReportData(
            Guid tenantId,
            DateTime dateRangeStart,
            DateTime dateRangeEnd,
            IEnumerable<string> includeCustomers = null,
            IEnumerable<uint> includeEmployees = null)
        {
            var tenant = await _tenantRepository.GetTenantAsync(tenantId);

            if (tenant == null)
            {
                return new BusinessLogicResponse<TimeActivityDetailsReportDto>(ErrorType.RequestedEntityNotFound, "Tenant not found");
            }

            // TODO: Check that user has access to this tenant and permission for the requested time activities data

            IEnumerable<Guid> parsedIncludedCustomerIds = null;
            IEnumerable<Guid> parsedIncludedEmployeeIds = null;

            if (includeCustomers.HasAny())
            {
                var customers = await _customerRepository.GetByTenantIdAsync(tenantId, includeCustomers);
                parsedIncludedCustomerIds = customers?.Select(c => c.EntityId);
            }

            if (includeEmployees.HasAny())
            {
                var employees = await _employeeRepository.GetByTenantIdAsync(tenantId, includeEmployees);
                parsedIncludedEmployeeIds = employees?.Select(e => e.EntityId);
            }

            var timeActivities = await _timeActivityRespository.GetFilteredAsync(
                tenantId,
                dateRangeStart,
                dateRangeEnd,
                parsedIncludedCustomerIds,
                parsedIncludedEmployeeIds);

            return new BusinessLogicResponse<TimeActivityDetailsReportDto>(
                new TimeActivityDetailsReportDto()
                {
                    Tenant = tenant,
                    DateRange = new DateRange(dateRangeStart, dateRangeEnd),
                    TimeActivities = timeActivities
                });
        }

        public async Task<BusinessLogicResponse<IEnumerable<TimeActivity>>> GetUnbilledTimeActivitiesForInvoicing(
            Guid tenantId,
            string customerNumber,
            DateTime dateRangeStart,
            DateTime dateRangeEnd)
        {
            var customers = await _customerRepository.GetByTenantIdAsync(tenantId, customerNumbers: new string[] { customerNumber });
            var customer = customers.FirstOrDefault();

            if (customer == null)
            {
                return new BusinessLogicResponse<IEnumerable<TimeActivity>>(ErrorType.RequestNotValid, $"Customer with Customer ID '{customerNumber}' does not exist.");
            }

            // TODO: Check that user has access to this tenant and permission for the requested time activities data

            var unbilledTimeActivities = await _timeActivityRespository.GetUnbilledItemsForInvoicingAsync(
                customer.EntityId,
                dateRangeStart,
                dateRangeEnd);

            return new BusinessLogicResponse<IEnumerable<TimeActivity>>(unbilledTimeActivities);
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

            // TODO: Check that user has access to this tenant and permission to create the requested time activity
            // NOTE: Creating a time activity for someone else might require a different permission than
            // creating a time activity for yourself.

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

        public async Task<BusinessLogicResponse<TimeActivity>> UpdateTimeActivity(TimeActivity timeActivity, Guid contextUserId)
        {
            var existingTimeActivity = await _timeActivityRespository.GetByIdAsync(timeActivity.Id);

            if (existingTimeActivity == null)
                return new BusinessLogicResponse<TimeActivity>(ErrorType.RequestedEntityNotFound);

            // TODO: Check that user has access to this tenant and permission for the requested time activity

            var updatedTimeActivity = await _timeActivityRespository.UpdateAsync(timeActivity, contextUserId);

            return new BusinessLogicResponse<TimeActivity>(updatedTimeActivity);
        }

        public async Task<BusinessLogicResponse> DeleteTimeActivity(Guid timeActivityId, Guid contextUserId)
        {
            var existingTimeActivity = await _timeActivityRespository.GetByIdAsync(timeActivityId);

            if (existingTimeActivity == null)
                return new BusinessLogicResponse<TimeActivity>(ErrorType.RequestedEntityNotFound);

            // TODO: Check that user has access to this tenant and permission for the requested time activity

            await _timeActivityRespository.DeleteAsync(timeActivityId, contextUserId);

            return new BusinessLogicResponse();
        }
    }
}
