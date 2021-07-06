using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ClosedXML.Report;
using DashAccountingSystemV2.Models;

namespace DashAccountingSystemV2.Services.Export
{
    public class BalanceSheetReportExporter : IDataExporter<BalanceSheetReportDto>
    {
        public Task<byte[]> GetDataExport(BaseExportRequestParameters parameters, BalanceSheetReportDto data)
        {
            throw new NotImplementedException();
        }
    }
}
