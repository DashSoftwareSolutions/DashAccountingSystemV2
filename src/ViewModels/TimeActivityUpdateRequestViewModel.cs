using System;
using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;
using DashAccountingSystemV2.Models;

namespace DashAccountingSystemV2.ViewModels
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
