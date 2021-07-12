using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DashAccountingSystemV2.Models
{
    public class Address
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public Guid Id { get; private set; }

        [Required]
        public Guid TenantId { get; set; }
        public Tenant Tenant { get; set; }

        [Required]
        public Guid EntityId { get; set; }
        public Entity Entity { get; set; }

        [Required(AllowEmptyStrings = false)]
        public AddressType AddressType { get; set; }

        [Required(AllowEmptyStrings = false)]
        [MaxLength(128)]
        public string StreetAddress1 { get; set; }

        [MaxLength(128)]
        public string StreetAddress2 { get; set; }

        [Required(AllowEmptyStrings = false)]
        [MaxLength(64)]
        public string City { get; set; }

        public int RegionId { get; set; }
        public Region Region { get; set; }

        [Required]
        public int CountryId { get; set; }
        public Country Country { get; set; }

        [MaxLength(16)]
        public string PostalCode { get; set; }

        public Address Clone()
        {
            return (Address)this.MemberwiseClone();
        }
    }
}
