﻿using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using DashAccountingSystemV2.Models;

namespace DashAccountingSystemV2.Repositories
{
    public interface ITimeActivityRepository
    {
        Task<TimeActivity> GetByIdAsync(Guid timeActivityId);

        Task<IEnumerable<TimeActivity>> GetFiltered(
            Guid tenantId,
            DateTime dateRangeStart,
            DateTime dateRangeEnd,
            IEnumerable<Guid> includeCustomers = null,
            IEnumerable<Guid> includeEmployees = null);

        Task<TimeActivity> InsertAsync(TimeActivity timeActivity);

        Task<TimeActivity> UpdateAsync(TimeActivity timeActivity);

        Task DeleteAsync(Guid timeActivityId);
    }
}
