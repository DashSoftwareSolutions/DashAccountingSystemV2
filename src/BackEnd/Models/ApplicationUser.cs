using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;

namespace DashAccountingSystemV2.BackEnd.Models
{
    public class ApplicationUser : IdentityUser<Guid>
    {
        [PersonalData]
        [Required(AllowEmptyStrings = false)]
        [Display(Name = "First Name")]
        [MaxLength(70)]
        public string? FirstName { get; set; }

        [PersonalData]
        [Required(AllowEmptyStrings = false)]
        [Display(Name = "Last Name")]
        [MaxLength(70)]
        public string? LastName { get; set; }

        [Column(TypeName = "TIMESTAMP")]
        public DateTime? EmailConfirmedDate { get; set; }

        [Column(TypeName = "TIMESTAMP")]
        public DateTime? PhoneConfirmedDate { get; set; }
    }
}
