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
    public class BalanceSheetReportExcelExporter : IDataExporter<BalanceSheetReportDto>
    {
        private readonly ILogger _logger = null;

        public BalanceSheetReportExcelExporter(ILogger<BalanceSheetReportExcelExporter> logger)
        {
            _logger = logger;
        }

        public Task<ExportedDataDto> GetDataExport(ExportRequestParameters parameters, BalanceSheetReportDto data)
        {
            try
            {
                using (var template = new XLTemplate(@$"{AppContext.BaseDirectory}\ExcelTemplates\BalanceSheetReport.xlsx"))
                {
                    template.AddVariable("tenant", data.Tenant);
                    template.AddVariable("reportDates", new { DateRangeEnd = data.DateRange.DateRangeEnd.ToString("D") });

                    template.AddVariable(
                        "assets",
                        data.Assets.Select(a => new
                        {
                            AccountName = a.Account.DisplayName,
                            Balance = a.CurrentBalance.WithNormalBalanceType(AmountType.Debit),
                        }));

                    template.AddVariable(
                        "liabilities",
                        data.Liabilities.Select(a => new
                        {
                            AccountName = a.Account.DisplayName,
                            Balance = a.CurrentBalance.WithNormalBalanceType(AmountType.Credit),
                        }));

                    var netIncome = new
                    {
                        AccountName = "Net Income",
                        Balance = data.NetIncome.WithNormalBalanceType(AmountType.Credit)
                    };

                    var equityAccounts = data
                        .Equity
                        .Select(a => new
                        {
                            AccountName = a.Account.DisplayName,
                            Balance = a.CurrentBalance.WithNormalBalanceType(AmountType.Credit),
                        })
                        .ToList();

                    equityAccounts.Add(netIncome);

                    template.AddVariable("equity", equityAccounts);

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
                _logger.LogError(ex, "Error generating Balance Sheet Report Excel extract");
                return Task.FromResult<ExportedDataDto>(null);
            }
        }

        private string GetFileName(string tenantName)
        {
            return $"{tenantName.Slugify(forceLowercase: false, delimiter: "_")}_BalanceSheetReport_{DateTime.Now:yyyy-MM-dd_HH_mm_ss}";
        }
    }
}
