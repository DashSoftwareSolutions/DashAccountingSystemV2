using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DashAccountingSystemV2.Models;

namespace DashAccountingSystemV2.BusinessLogic
{
    public interface ITenantBusinessLogic : IBusinessLogic
    {
        Task<BusinessLogicResponse<IEnumerable<Tenant>>> GetTenants();
    }
}
