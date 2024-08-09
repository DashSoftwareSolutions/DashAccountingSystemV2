using Microsoft.AspNetCore.Identity;

namespace DashAccountingSystemV2.BackEnd.Models
{
    public class ApplicationRole : IdentityRole<Guid>
    {
        public string? Description { get; set; }
    }
}
