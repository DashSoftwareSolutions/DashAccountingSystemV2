using Microsoft.AspNetCore.Identity;

namespace DashAccountingSystemV2.Models
{
    public class ApplicationRole : IdentityRole<Guid>
    {
        public string? Description { get; set; }
    }
}
