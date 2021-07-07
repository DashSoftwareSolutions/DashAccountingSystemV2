using System;

namespace DashAccountingSystemV2.Services.Export
{
    public class ExportResultDto
    {
        public ExportFormat ExportFormat { get; set; }

        public ExportType ExportType { get; set; }

        public Guid TenantId { get; set; }

        public string Token { get; set; }

        public string FileName { get; set; }

        public bool IsSuccessful { get; set; }

        public string Error { get; set; }

        public ExportResultDto() { }

        public ExportResultDto(ExportRequestParameters parameters)
        {
            ExportFormat = parameters.ExportFormat;
            ExportType = parameters.ExportType;
            TenantId = parameters.TenantId;
        }

        public ExportResultDto(
            ExportRequestParameters parameters,
            string errorMessage)
            : this(parameters)
        {
            IsSuccessful = false;
            Error = errorMessage;
        }

        public ExportResultDto(
            ExportRequestParameters parameters,
            string fileName,
            string downloadAccessToken)
            : this(parameters)
        {
            IsSuccessful = true;
            FileName = fileName;
            Token = downloadAccessToken;
        }
    }
}
