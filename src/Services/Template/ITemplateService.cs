using System.Threading.Tasks;

namespace DashAccountingSystemV2.Services.Template
{
    public interface ITemplateService
    {
        /// <summary>
        /// Gets resulting HTML from the specified Razor Template and model object
        /// </summary>
        /// <param name="razorTemplateName">Razor Template Name</param>
        /// <param name="model">Model to bind to the Razor Template to produce the HTML output</param>
        /// <returns>Resulting HTML</returns>
        Task<string> GetHtmlFromRazorTemplate(string razorTemplateName, object model);
    }
}
