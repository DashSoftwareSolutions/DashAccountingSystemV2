using DashAccountingSystemV2.BackEnd.Models;

namespace DashAccountingSystemV2.BackEnd.ViewModels
{
    public class CountryResponseViewModel
    {
        public int Id { get; set; }

        public string Name { get; set; }

        /// <summary>
        /// ISO-3611-Alpha-2 two letter abbreviation
        /// </summary>
        public string TwoLetterCode { get; set; }

        /// <summary>
        /// ISO-3611-Alpha-2 two letter abbreviation
        /// </summary>
        public string ThreeLetterCode { get; set; }

        public static CountryResponseViewModel FromModel(Country model)
        {
            if (model == null)
                return null;

            return new CountryResponseViewModel()
            {
                Id = model.Id,
                Name = model.Name,
                ThreeLetterCode = model.ThreeLetterCode,
                TwoLetterCode = model.TwoLetterCode,
            };
        }
    }
}
