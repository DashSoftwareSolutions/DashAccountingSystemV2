using DashAccountingSystemV2.BackEnd.Models;

namespace DashAccountingSystemV2.BackEnd.ViewModels
{
    public class RegionResponseViewModel
    {
        public int Id { get; set; }

        /// <summary>
        /// What "kind" of region this is, e.g. "State", "Province", etc.
        /// </summary>
        public string Label { get; set; }

        public string Name { get; set; }

        /// <summary>
        /// ISO 3166-2 Code for the Region (only the regional/local segment; not including the parent Country code)
        /// </summary>
        /// <remarks>
        /// <see href="https://en.wikipedia.org/wiki/ISO_3166-2"/>
        /// </remarks>
        public string Code { get; set; }

        public static RegionResponseViewModel FromModel(Region model)
        {
            if (model == null)
                return null;

            return new RegionResponseViewModel()
            {
                Id = model.Id,
                Label = model.Label,
                Name = model.Name,
                Code = model.Code,
            };
        }
    }
}
