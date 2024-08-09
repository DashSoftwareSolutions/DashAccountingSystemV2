using System.Text;
using RazorLight.Razor;

namespace DashAccountingSystemV2.BackEnd.Services.Template
{
    /// <summary>
    /// This type is necessary to help the RazorLight templating engine resolve partial views.<br />
    /// See:<br />
    /// <see href="https://github.com/toddams/RazorLight#custom-source"/><br />
    /// <see href="https://github.com/toddams/RazorLight#includes-aka-partial-views"/>
    /// </summary>
    public class DashRazorLightProjectItem : RazorLightProjectItem
    {
        private string _content;

        public DashRazorLightProjectItem(string key, string content)
        {
            Key = key;
            _content = content;
        }

        public override string Key { get; }

        public override bool Exists => _content != null;

        public override Stream Read()
        {
            return new MemoryStream(Encoding.UTF8.GetBytes(_content));
        }
    }
}
