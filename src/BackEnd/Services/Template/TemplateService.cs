using System.Collections.Concurrent;
using RazorLight;
using RazorLight.Razor;

namespace DashAccountingSystemV2.BackEnd.Services.Template
{
    /// <summary>
    /// HTML + Razor Template service
    /// </summary>
    /// <remarks>
    /// In order to use Razor you have to set <code>&lt;PreserveCompilationContext&gt;true&lt;/PreserveCompilationContext&gt;</code> 
    /// and <code>&lt;PreserveCompilationReferences&gt;true&lt;/PreserveCompilationReferences&gt;</code> in the root project.<br />
    /// <br />
    /// Other possible issues are described on RazorLight GitHub page:<br />
    /// <see href="https://github.com/toddams/RazorLight"/>
    /// </remarks>
    public class TemplateService : ITemplateService
    {
        private readonly ILogger _logger;
        private readonly RazorLightEngine _razorEngine;
        private readonly RazorLightProject _razorProject;
        private readonly ITemplateProvider _templateProvider;

        private static readonly ConcurrentDictionary<string, int> _latestTemplateVersions = new ConcurrentDictionary<string, int>();

        public TemplateService(ITemplateProvider templateProvider, ILogger<TemplateService> logger)
        {
            _logger = logger;
            _templateProvider = templateProvider;

            _razorProject = new DashRazorLightProject(templateProvider);

            _razorEngine = new RazorLightEngineBuilder()
                .UseEmbeddedResourcesProject(typeof(TemplateService))
                .UseProject(_razorProject)
                .UseMemoryCachingProvider()
                .Build();
        }

        public async Task<string> GetHtmlFromRazorTemplate(string razorTemplateName, object model)
        {
            if (string.IsNullOrWhiteSpace(razorTemplateName))
            {
                _logger.LogError("Razor Template Name was null or empty.  Bailing out.");
                return null;
            }

            var razorTemplateContent = await _templateProvider.GetTemplate(razorTemplateName);

            if (string.IsNullOrWhiteSpace(razorTemplateContent))
            {
                _logger.LogError("Razor Template content was null or empty.  Bailing out.");
                return null;
            }

            try
            {
                // The Razor engine's cache doesn't expire, so we'll check the incoming raw value of template to see if it varies from the previous (cached) version.
                // To do this reasonably efficiently, we'll use the template content's HashCode as part of the cache key
                // (we'll think of this as a "version number" of sorts for the template).
                // The goal is to ensure that different template content (even for the same template name) results in a cache miss and gets freshly evaluated.
                var incomingVersionNumber = razorTemplateContent.GetHashCode(StringComparison.Ordinal);
                var razorCacheKey = $"{razorTemplateName}_{incomingVersionNumber}";

                if (_latestTemplateVersions.TryGetValue(razorTemplateName, out int existingVersionNumber) && incomingVersionNumber == existingVersionNumber)
                {
                    // No changes to previously cached version.  Retrieve it from razor engine's cache and process.
                    var cacheResult = _razorEngine.Handler.Cache.RetrieveTemplate(razorCacheKey);
                    
                    if (cacheResult.Success)
                        return await _razorEngine.RenderTemplateAsync(cacheResult.Template.TemplatePageFactory(), model);
                }

                // Template content is now or has been modified.  Add to both caches and process.
                var result = await _razorEngine.CompileRenderStringAsync(razorCacheKey, razorTemplateContent, model);
                
                _latestTemplateVersions.AddOrUpdate(razorTemplateName, incomingVersionNumber, (k, v) => incomingVersionNumber);
                
                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Template Service encountered a problem while evaluating Razor Template {razorTemplateName}", razorTemplateName);
                return null;
            }
        }
    }
}
