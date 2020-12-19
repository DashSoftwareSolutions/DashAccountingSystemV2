using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DashAccountingSystemV2.Models
{
    public enum TransactionStatus : short
    {
        Unknown = 0,
        Pending = 1,
        Posted = 2,
        Canceled = 3,
    }
}
