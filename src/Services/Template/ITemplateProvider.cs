using System;
using System.Threading.Tasks;

namespace DashAccountingSystemV2.Services.Template
{
    public interface ITemplateProvider
    {
        Task<string> GetTemplate(Guid tenantId, string templateName);
    }
}
