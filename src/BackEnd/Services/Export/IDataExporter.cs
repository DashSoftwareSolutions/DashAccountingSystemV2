namespace DashAccountingSystemV2.BackEnd.Services.Export
{
    /// <summary>
    /// Marker interface for Data Exporters, to be used with the factory pattern.
    /// </summary>
    public interface IDataExporter
    {
    }

    /// <summary>
    /// Generic interface for Data Exporters that actually specifies the contract.
    /// </summary>
    /// <typeparam name="TUnderlyingData">Type of model or DTO that will be sent to the Data Exporter</typeparam>
    public interface IDataExporter<TUnderlyingData> : IDataExporter
    {
        Task<ExportedDataDto?> GetDataExport(ExportRequestParameters parameters, TUnderlyingData data);
    }
}
