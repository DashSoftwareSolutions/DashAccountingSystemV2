using System.Threading.Tasks;

namespace DashAccountingSystemV2.Services.Export
{
    public interface IDataExporter<TUnderlyingData>
    {
        Task<ExportedDataDto> GetDataExport(ExportRequestParameters parameters, TUnderlyingData data);
    }
}
