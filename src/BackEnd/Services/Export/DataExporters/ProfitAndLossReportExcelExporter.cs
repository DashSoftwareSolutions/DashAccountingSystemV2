using ClosedXML.Report;
using DashAccountingSystemV2.BackEnd.Extensions;
using DashAccountingSystemV2.BackEnd.Models;

namespace DashAccountingSystemV2.BackEnd.Services.Export.DataExporters
{
    public class ProfitAndLossReportExcelExporter(ILogger<ProfitAndLossReportExcelExporter> logger) : IDataExporter<ProfitAndLossReportDto>
    {
        public Task<ExportedDataDto?> GetDataExport(ExportRequestParameters parameters, ProfitAndLossReportDto data)
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
                logger.LogError(ex, "Error generating Profit & Loss Report Excel extract");
                return Task.FromResult<ExportedDataDto?>(null);
            }
        }

        private static string GetFileName(string tenantName) =>
            $"{tenantName.Slugify(forceLowercase: false, delimiter: "_")}_ProfitAndLossReport_{DateTime.Now:yyyy-MM-dd_HH_mm_ss}";
    }
}
