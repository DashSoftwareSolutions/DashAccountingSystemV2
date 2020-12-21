using System.Linq;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace DashAccountingSystemV2.Extensions
{
    public static class ModelStateDictionaryExtensions
    {
        public static string ToErrorMessageString(this ModelStateDictionary modelState)
        {
            return string.Join("|",
                modelState.Values.Where(v => v.Errors.Count > 0)
                                 .SelectMany(v => v.Errors)
                                 .Select(v => v.Exception == null ? v.ErrorMessage : v.Exception.Message));
        }
    }
}
