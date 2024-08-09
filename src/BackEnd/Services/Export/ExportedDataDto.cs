namespace DashAccountingSystemV2.BackEnd.Services.Export
{
    public class ExportedDataDto
    {
        public string FileName { get; set; } = string.Empty;
        public byte[] Content { get; set; } = [];
    }
}
