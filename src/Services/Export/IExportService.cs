using System.Threading.Tasks;

namespace DashAccountingSystemV2.Services.Export
{
    public interface IExportService
    {
        Task<ExportResultDto> GetDataExport<TUnderlyingData>(
            ExportRequestParameters parameters,
            TUnderlyingData data) where TUnderlyingData : class;
    }
}
