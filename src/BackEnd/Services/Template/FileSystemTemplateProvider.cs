namespace DashAccountingSystemV2.BackEnd.Services.Template
{
    public class FileSystemTemplateProvider : ITemplateProvider
    {
        private const string _TemplatesDirectory = "RazorTemplates";

        private readonly ILogger _logger;

        public FileSystemTemplateProvider(ILogger<FileSystemTemplateProvider> logger)
        {
            _logger = logger;
        }

        public Task<string> GetTemplate(string templateName)
        {
            var filePath = $"{AppContext.BaseDirectory}{Path.DirectorySeparatorChar}{_TemplatesDirectory}{Path.DirectorySeparatorChar}{templateName}";

            if (!File.Exists(filePath))
            {
                _logger.LogError(
                    "Request Template File {templateName} was not found in the expected folder {templatesFolder}",
                    templateName,
                    _TemplatesDirectory);

                return Task.FromResult<string>(null);
            }

            return File.ReadAllTextAsync(filePath);
        }
    }
}
