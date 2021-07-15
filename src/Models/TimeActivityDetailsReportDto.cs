using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DashAccountingSystemV2.Models
{
    public class TimeActivityDetailsReportDto
    {
        public Tenant Tenant { get; set; }

        public DateRange DateRange { get; set; }

        public IEnumerable<TimeActivity> TimeActivities { get; set; }
    }
}
