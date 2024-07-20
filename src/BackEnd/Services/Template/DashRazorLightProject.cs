using RazorLight.Razor;

namespace DashAccountingSystemV2.BackEnd.Services.Template
{
    /// <summary>
    /// This type is necessary to help the RazorLight templating engine resolve partial views.<br />
    /// See:<br />
    /// <see href="https://github.com/toddams/RazorLight#custom-source"/><br />
    /// <see href="https://github.com/toddams/RazorLight#includes-aka-partial-views"/>
    /// </summary>
    public class DashRazorLightProject : RazorLightProject
    {
        private readonly ITemplateProvider _templateProvider;

        public DashRazorLightProject(ITemplateProvider templateProvider)
        {
            _templateProvider = templateProvider;
        }

        public override Task<IEnumerable<RazorLightProjectItem>> GetImportsAsync(string templateKey)
        {
            return Task.FromResult(Enumerable.Empty<RazorLightProjectItem>());
        }

        public override async Task<RazorLightProjectItem> GetItemAsync(string templateKey)
        {
            var templateContent = await _templateProvider.GetTemplate(templateKey);

            return new DashRazorLightProjectItem(templateKey, templateContent);
        }
    }
}
