using System.Reflection;
using QuestPDF.Drawing;
using QuestPDF.Infrastructure;

namespace DashAccountingSystemV2.BackEnd.Services.Export.PdfDocuments
{
    /// <summary>
    /// One-time, process-wide setup for the QuestPDF library.
    /// </summary>
    public static class QuestPdfConfiguration
    {
        /// <summary>
        /// Liberation Sans is metric-compatible with Arial and licensed under the SIL Open Font License, so it can be bundled.
        /// QuestPDF only uses fonts registered with its <see cref="FontManager"/> (system fonts are disabled by default),
        /// which keeps the output identical regardless of what fonts the host happens to have installed.
        /// </summary>
        public const string DefaultFontFamily = "Liberation Sans";

        private static readonly string[] _FontResourceNames =
        [
            "DashAccountingSystemV2.BackEnd.PdfAssets.LiberationSans-Regular.ttf",
            "DashAccountingSystemV2.BackEnd.PdfAssets.LiberationSans-Bold.ttf",
            "DashAccountingSystemV2.BackEnd.PdfAssets.LiberationSans-Italic.ttf",
            "DashAccountingSystemV2.BackEnd.PdfAssets.LiberationSans-BoldItalic.ttf",
        ];

        private static readonly Lazy<bool> _configured = new(Configure);

        /// <summary>
        /// Applies the QuestPDF license and registers the bundled fonts.  Safe to call more than once.
        /// </summary>
        public static void EnsureConfigured() => _ = _configured.Value;

        private static bool Configure()
        {
            // QuestPDF Community License: free for businesses with under $1M USD annual gross revenue.
            // See https://www.questpdf.com/license/
            QuestPDF.Settings.License = LicenseType.Community;

            var assembly = Assembly.GetExecutingAssembly();

            foreach (var fontResourceName in _FontResourceNames)
            {
                FontManager.RegisterFontFromEmbeddedResource(assembly, fontResourceName);
            }

            return true;
        }
    }
}
