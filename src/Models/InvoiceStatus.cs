using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DashAccountingSystemV2.Models
{
    public enum InvoiceStatus : short
    {
        Unknown = 0,
        Draft = 1,
        Sent = 2,
        Paid = 3,
    }
}
