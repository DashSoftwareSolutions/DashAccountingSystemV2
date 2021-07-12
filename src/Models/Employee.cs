using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DashAccountingSystemV2.Models
{
    public class Employee
    {
        #region Entity ID and Tenant ID
        [Key]
        [ForeignKey("Entity")]
        [Required]
        public Guid EntityId { get; set; }
        public Entity Entity { get; set; }

        public Guid TenantId { get; set; }
        public Tenant Tenant { get; set; }
        #endregion Entity ID and Tenant ID

        #region Base Person Properties
        [MaxLength(10)]
        public string Title { get; set; }

        [Required(AllowEmptyStrings = false)]
        [MaxLength(100)]
        public string FirstName { get; set; }

        [MaxLength(100)]
        public string MiddleName { get; set; }

        [Required(AllowEmptyStrings = false)]
        [MaxLength(100)]
        public string LastName { get; set; }

        [MaxLength(100)]
        public string NickName { get; set; }

        [MaxLength(10)]
        public string Suffix { get; set; }

        [Required]
        [MaxLength(256)]
        public string DisplayName { get; set; }

        [MaxLength(1)]
        public char? GenderChar
        {
            get
            {
                return Gender == null ? null : (char)Gender;
            }
            set
            {
                Gender = value == null ? null : (Gender)value;
            }
        }

        [NotMapped]
        public Gender Gender { get; set; }

        public DateTime? DateOfBirth { get; set; }

        public Guid MailingAddressId { get; set; }
        public Address MailingAddress { get; set; }

        [EmailAddress]
        [MaxLength(256)]
        public string Email { get; set; }

        [Phone]
        [MaxLength(32)]
        public string HomePhoneNumber { get; set; }

        [Phone]
        [MaxLength(32)]
        public string MobilePhoneNumber { get; set; }

        /// <summary>
        /// User associated to this Person (i.e. an Employee, Contractor etc. who is also a User of the system)
        /// </summary>
        public Guid? UserId { get; set; }
        public ApplicationUser User { get; set; }
        #endregion Base Person Properties

        #region Employee Properties
        [Required]
        public uint EmployeeNumber { get; set; }

        [Required(AllowEmptyStrings = false)]
        [MaxLength(128)]
        public string JobTitle { get; set; }

        [Required]
        public DateTime HireDate { get; set; }

        public DateTime? ReleaseDate { get; set; }

        public decimal? HourlyBillingRate { get; set; }

        public bool IsBillableByDefault { get; set; }
        #endregion Employee Properties
    }
}
