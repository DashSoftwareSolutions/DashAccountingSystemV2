using System;
using System.Collections.Generic;
using DashAccountingSystemV2.Extensions;

namespace DashAccountingSystemV2.ViewModels
{
    public class InvoiceFilterRequestViewModel
    {
        public string DateRangeStart { get; set; }

        public string DateRangeEnd { get; set; }

        public string Customers { get; set; }

        public DateTime? ParsedDateRangeStart => DateRangeStart.TryParseAsDateTime();

        public DateTime? ParsedDateRangeEnd => DateRangeEnd.TryParseAsDateTime();

        public IEnumerable<Guid> ParsedCustomerIds => Customers.ParseCommaSeparatedGuids();
    }
}
