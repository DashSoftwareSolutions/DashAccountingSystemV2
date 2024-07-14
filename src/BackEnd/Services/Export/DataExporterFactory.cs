namespace DashAccountingSystemV2.BackEnd.Services.Export
{
    public class DataExporterFactory : IDataExporterFactory
    {
        public Func<Type, ExportRequestParameters, IDataExporter> DataExporterFactoryMethod { get; private set; }

        public DataExporterFactory(Func<Type, ExportRequestParameters, IDataExporter> dataExporterFactoryMethod)
        {
            DataExporterFactoryMethod = dataExporterFactoryMethod;
        }

        public IDataExporter CreateDataExporter(Type typeOfDataModel, ExportRequestParameters exportRequestParameters)
        {
            return DataExporterFactoryMethod(typeOfDataModel, exportRequestParameters);
        }
    }
}
