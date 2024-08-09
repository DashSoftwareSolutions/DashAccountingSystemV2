namespace DashAccountingSystemV2.BackEnd.Services.Template
{
    public interface ITemplateProvider
    {
        Task<string> GetTemplate(string templateName);
    }
}
