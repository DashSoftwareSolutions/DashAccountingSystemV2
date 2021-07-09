using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using ClosedXML.Report;
using DashAccountingSystemV2.Extensions;
using DashAccountingSystemV2.Models;

namespace DashAccountingSystemV2.Services.Export.DataExporters
{
    public class ProfitAndLossReportExcelExporter : IDataExporter<ProfitAndLossReportDto>
    {
        private readonly ILogger _logger = null;

        public ProfitAndLossReportExcelExporter(ILogger<ProfitAndLossReportExcelExporter> logger)
        {
            _logger = logger;
        }

        public Task<ExportedDataDto> GetDataExport(ExportRequestParameters parameters, ProfitAndLossReportDto data)
        {
            try
            {
                using (var template = new XLTemplate(@$"{AppContext.BaseDirectory}\ExcelTemplates\ProfitAndLossReport.xlsx"))
                {
                    template.AddVariable("tenant", data.Tenant);

                    var startMonth = data.DateRange.DateRangeStart.Year == data.DateRange.DateRangeEnd.Year ?
                         data.DateRange.DateRangeStart.ToString("MMMM") :
                         data.DateRange.DateRangeStart.ToString("MMMM yyyy");

                    template.AddVariable("reportDates", new { StartMonth = startMonth, EndMonth = data.DateRange.DateRangeEnd.ToString("MMMM yyyy") });

                    template.AddVariable(
                        "operatingIncome",
                        data.OperatingIncome.Select(a => new
                        {
                            AccountName = a.Account.DisplayName,
                            Balance = a.CurrentBalance.WithNormalBalanceType(AmountType.Credit),
                        }));

                    template.AddVariable(
                        "operatingExpenses",
                        data.OperatingExpenses.Select(a => new
                        {
                            AccountName = a.Account.DisplayName,
                            Balance = a.CurrentBalance.WithNormalBalanceType(AmountType.Debit),
                        }));

                    template.AddVariable(
                        "otherIncome",
                        data.OtherIncome.Select(a => new
                        {
                            AccountName = a.Account.DisplayName,
                            Balance = a.CurrentBalance.WithNormalBalanceType(AmountType.Credit),
                        }));

                    template.AddVariable(
                        "otherExpenses",
                        data.OtherExpenses.Select(a => new
                        {
                            AccountName = a.Account.DisplayName,
                            Balance = a.CurrentBalance.WithNormalBalanceType(AmountType.Debit),
                        }));

                    template.AddVariable(
                        "reportDateAndMetadata",
                        $"{DateTime.Now.ToString("dddd MMM dd, yyyy hh:mm:ss tt zzz")} - Cash Basis"); // TODO: Be locale and timezone aware on this date/time

                    template.Generate();

                    using (var ms = new MemoryStream())
                    {
                        template.SaveAs(ms);
                        ms.Position = 0;

                        var result = new ExportedDataDto()
                        {
                            FileName = GetFileName(data.Tenant.Name),
                            Content = ms.ToArray()
                        };

                        return Task.FromResult(result);
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating Profit & Loss Report Excel extract");
                return Task.FromResult<ExportedDataDto>(null);
            }
        }

        private string GetFileName(string tenantName)
        {
            return $"{tenantName.Slugify(forceLowercase: false, delimiter: "_")}_ProfitAndLossReport_{DateTime.Now:yyyy-MM-dd_HH_mm_ss}";
        }
    }
}
