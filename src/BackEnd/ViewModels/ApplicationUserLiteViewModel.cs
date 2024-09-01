using DashAccountingSystemV2.BackEnd.Models;

namespace DashAccountingSystemV2.BackEnd.ViewModels
{
    public class ApplicationUserLiteViewModel
    {
        public Guid Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }

        public ApplicationUserLiteViewModel() { }

        public ApplicationUserLiteViewModel(ApplicationUser applicationUser)
        {
            if (applicationUser == null)
                throw new ArgumentNullException(nameof(applicationUser));

            Id = applicationUser.Id;
            FirstName = applicationUser.FirstName;
            LastName = applicationUser.LastName;
        }

        public static ApplicationUserLiteViewModel FromModel(ApplicationUser applicationUser)
        {
            if (applicationUser == null)
                return null;

            return new ApplicationUserLiteViewModel(applicationUser);
        }
    }
}
