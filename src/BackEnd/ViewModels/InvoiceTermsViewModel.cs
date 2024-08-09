using DashAccountingSystemV2.BackEnd.Models;

namespace DashAccountingSystemV2.BackEnd.ViewModels
{
    public class InvoiceTermsViewModel
    {
        public Guid Id { get; set; }

        public Guid? TenantId { get; set; }

        public bool IsCustom => TenantId.HasValue;

        public string Name { get; set; }

        public ushort? DueInDays { get; set; }

        public ushort? DueOnDayOfMonth { get; set; }

        public ushort? DueNextMonthThreshold { get; set; }

        public static InvoiceTermsViewModel FromModel(InvoiceTerms model)
        {
            if (model == null)
                return null;

            return new InvoiceTermsViewModel()
            {
                Id = model.Id,
                TenantId = model.TenantId,
                Name = model.Name,
                DueInDays = model.DueInDays,
                DueNextMonthThreshold = model.DueNextMonthThreshold,
                DueOnDayOfMonth = model.DueOnDayOfMonth,
            };
        }
    }
}
