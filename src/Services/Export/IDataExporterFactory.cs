using System;

namespace DashAccountingSystemV2.Services.Export
{
    public interface IDataExporterFactory
    {
        IDataExporter CreateDataExporter(Type typeOfDataModel, ExportRequestParameters exportRequestParameters);

        Func<Type, ExportRequestParameters, IDataExporter> DataExporterFactoryMethod { get; }
    }
}
