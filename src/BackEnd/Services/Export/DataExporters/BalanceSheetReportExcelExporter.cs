using ClosedXML.Report;
using DashAccountingSystemV2.BackEnd.Extensions;
using DashAccountingSystemV2.BackEnd.Models;

namespace DashAccountingSystemV2.BackEnd.Services.Export.DataExporters
{
    public class BalanceSheetReportExcelExporter(ILogger<BalanceSheetReportExcelExporter> logger) : IDataExporter<BalanceSheetReportDto>
    {
        public Task<ExportedDataDto?> GetDataExport(ExportRequestParameters parameters, BalanceSheetReportDto data)
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
                        $"{DateTime.Now.ToString("dddd MMM dd, yyyy hh:mm:ss tt zzz")} - Cash Basis"); // TODO: Be locale and time zone aware on this date/time

                    template.Generate();

                    using var ms = new MemoryStream();

                    template.SaveAs(ms);
                    ms.Position = 0;

                    var result = new ExportedDataDto()
                    {
                        FileName = GetFileName(data.Tenant.Name),
                        Content = ms.ToArray()
                    };

                    return Task.FromResult<ExportedDataDto?>(result);
                }
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error generating Balance Sheet Report Excel extract");
                return Task.FromResult<ExportedDataDto?>(null);
            }
        }

        private static string GetFileName(string tenantName) =>
            $"{tenantName.Slugify(forceLowercase: false, delimiter: "_")}_BalanceSheetReport_{DateTime.Now:yyyy-MM-dd_HH_mm_ss}";
    }
}
