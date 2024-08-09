namespace DashAccountingSystemV2.BackEnd.Services.Export
{
    public interface IExportService
    {
        Task<ExportResultDto> GetDataExport<TUnderlyingData>(
            ExportRequestParameters parameters,
            TUnderlyingData data) where TUnderlyingData : class;
    }
}
