using System.Threading.Tasks;

namespace DashAccountingSystemV2.Services.Export
{
    public interface IDataExporter<TUnderlyingData>
    {
        Task<byte[]> GetDataExport(BaseExportRequestParameters parameters, TUnderlyingData data);
    }
}
