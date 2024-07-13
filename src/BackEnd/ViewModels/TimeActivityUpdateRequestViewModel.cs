using System.ComponentModel.DataAnnotations;
using DashAccountingSystemV2.BackEnd.Models;

namespace DashAccountingSystemV2.BackEnd.ViewModels
{
    public class TimeActivityUpdateRequestViewModel : TimeActivityCreateRequestViewModel
    {
        [Required]
        public Guid Id { get; set; }

        public static TimeActivity ToModel(TimeActivityUpdateRequestViewModel viewModel)
        {
            if (viewModel == null)
                return null;

            var model = TimeActivityCreateRequestViewModel.ToModel(viewModel);
            model.Id = viewModel.Id;

            return model;
        }
    }
}
