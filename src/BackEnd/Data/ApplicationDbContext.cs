using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using DashAccountingSystemV2.BackEnd.Models;

namespace DashAccountingSystemV2.BackEnd.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser, ApplicationRole, Guid>
    {
        public ApplicationDbContext(DbContextOptions options)
            : base(options)
        {
        }

        #region Accounting
        /// <summary>
        /// Gets or sets the <see cref="DbSet{AccountType}"/>.
        /// </summary>
        public DbSet<AccountType> AccountType { get; set; }

        /// <summary>
        /// Gets or sets the <see cref="DbSet{AccountSubType}"/>.
        /// </summary>
        public DbSet<AccountSubType> AccountSubType { get; set; }

        /// <summary>
        /// Gets or sets the <see cref="DbSet{AssetType}"/>.
        /// </summary>
        public DbSet<AssetType> AssetType { get; set; }

        /// <summary>
        /// Gets or sets the <see cref="DbSet{Tenant}"/>.
        /// </summary>
        public DbSet<Tenant> Tenant { get; set; }

        /// <summary>
        /// Gets or sets the <see cref="DbSet{Account}"/>.
        /// </summary>
        public DbSet<Account> Account { get; set; }

        /// <summary>
        /// Gets or sets the <see cref="DbSet{JournalEntry}"/>.
        /// </summary>
        public DbSet<JournalEntry> JournalEntry { get; set; }

        /// <summary>
        /// Gets or sets the <see cref="DbSet{JournalEntryAccount}"/>.
        /// </summary>
        public DbSet<JournalEntryAccount> JournalEntryAccount { get; set; }

        /// <summary>
        /// Gets or sets the <see cref="DbSet{ReconciliationReport}"/>.
        /// </summary>
        public DbSet<ReconciliationReport> ReconciliationReport { get; set; }
        #endregion Accounting

        #region Address Lookups
        public DbSet<Country> Country { get; set; }

        public DbSet<Region> Region { get; set; }
        #endregion Address Lookups

        #region Employee Time Tracking / Sales & Invoicing
        public DbSet<Entity> Entity { get; set; }

        public DbSet<Address> Address { get; set; }

        public DbSet<Employee> Employee { get; set; }

        public DbSet<Customer> Customer { get; set; }

        public DbSet<Product> Product { get; set; }

        public DbSet<ProductCategory> ProductCategory { get; set; }

        public DbSet<TimeActivity> TimeActivity { get; set; }

        public DbSet<InvoiceTerms> InvoiceTerms { get; set; }

        public DbSet<Invoice> Invoice { get; set; }

        public DbSet<InvoiceLineItem> InvoiceLineItem { get; set; }

        public DbSet<PaymentMethod> PaymentMethod { get; set; }

        public DbSet<Payment> Payment { get; set; }
        #endregion Employee Time Tracking / Sales & Invoicing

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            #region Accounting
            builder.Entity<AccountType>()
                .HasIndex(at => at.Name)
                .IsUnique();

            builder.Entity<AccountSubType>()
                .HasIndex(ast => ast.Name)
                .IsUnique();

            builder.Entity<AssetType>()
                .HasIndex(at => at.Name)
                .IsUnique();

            builder.Entity<Tenant>()
                .HasIndex(t => t.Name)
                .IsUnique();

            builder.Entity<Tenant>()
                .Property("Id")
                .HasColumnType("UUID")
                .HasDefaultValueSql(GENERATE_GUID)
                .ValueGeneratedOnAdd();

            builder.Entity<Account>()
                .HasIndex(a => new { a.TenantId, a.AccountNumber })
                .IsUnique();

            builder.Entity<Account>()
                .HasIndex(a => new { a.TenantId, a.Name })
                .IsUnique();

            builder.Entity<Account>()
                .HasIndex(a => a.TenantId);

            builder.Entity<Account>()
                .Property("Id")
                .HasColumnType("UUID")
                .HasDefaultValueSql(GENERATE_GUID)
                .ValueGeneratedOnAdd();

            builder.Entity<Account>()
                .Property("Created")
                .HasColumnType("TIMESTAMP")
                .HasDefaultValueSql(GET_UTC_TIMESTAMP)
                .ValueGeneratedOnAdd();

            builder.Entity<JournalEntry>()
                .HasIndex(je => new { je.TenantId, je.EntryId })
                .IsUnique();

            builder.Entity<JournalEntry>()
                .HasIndex(je => je.TenantId);

            builder.Entity<JournalEntry>()
                .Property("Id")
                .HasColumnType("UUID")
                .HasDefaultValueSql(GENERATE_GUID)
                .ValueGeneratedOnAdd();

            builder.Entity<JournalEntry>()
                .Property("Created")
                .HasColumnType("TIMESTAMP")
                .HasDefaultValueSql(GET_UTC_TIMESTAMP)
                .ValueGeneratedOnAdd();

            builder.Entity<JournalEntryAccount>()
                .HasKey(jea => new { jea.JournalEntryId, jea.AccountId });

            builder.Entity<JournalEntryAccount>()
                .HasIndex(jea => jea.JournalEntryId);

            builder.Entity<JournalEntryAccount>()
                .HasIndex(jea => jea.AccountId);

            builder.Entity<ReconciliationReport>()
                .Property("Id")
                .HasColumnType("UUID")
                .HasDefaultValueSql(GENERATE_GUID)
                .ValueGeneratedOnAdd();

            builder.Entity<ReconciliationReport>()
                .Property("Created")
                .HasColumnType("TIMESTAMP")
                .HasDefaultValueSql(GET_UTC_TIMESTAMP)
                .ValueGeneratedOnAdd();

            builder.Entity<ReconciliationReport>()
                .HasIndex(rr => rr.AccountId);
            #endregion Accounting

            #region Address Lookups
            builder.Entity<Country>()
                .HasIndex(c => c.TwoLetterCode)
                .IsUnique();

            builder.Entity<Country>()
                .HasIndex(c => c.ThreeLetterCode)
                .IsUnique();

            builder.Entity<Region>()
                .HasIndex(r => r.CountryId);

            builder.Entity<Region>()
                .HasIndex(r => new { r.CountryId, r.Code })
                .IsUnique();
            #endregion Address Lookups

            #region Employee Time Tracking / Sales & Invoicing
            builder.Entity<Entity>()
                .HasIndex(e => e.TenantId);

            builder.Entity<Entity>()
                .Property("Id")
                .HasColumnType("UUID")
                .HasDefaultValueSql(GENERATE_GUID)
                .ValueGeneratedOnAdd();

            builder.Entity<Entity>()
                .Property("Created")
                .HasColumnType("TIMESTAMP")
                .HasDefaultValueSql(GET_UTC_TIMESTAMP)
                .ValueGeneratedOnAdd();

            builder.Entity<Address>()
                .Property("Id")
                .HasColumnType("UUID")
                .HasDefaultValueSql(GENERATE_GUID)
                .ValueGeneratedOnAdd();

            builder.Entity<Address>()
                .Property("Created")
                .HasColumnType("TIMESTAMP")
                .HasDefaultValueSql(GET_UTC_TIMESTAMP)
                .ValueGeneratedOnAdd();

            builder.Entity<Address>()
                .Property(a => a.AddressType)
                .HasColumnType("INT4")
                .HasConversion(
                    v => (int)v,
                    v => (AddressType)v);

            builder.Entity<Employee>()
                .HasIndex(e => e.EntityId)
                .IsUnique();

            builder.Entity<Employee>()
                .HasIndex(e => new { e.TenantId, e.EmployeeNumber })
                .IsUnique();

            builder.Entity<Customer>()
                .HasIndex(c => c.EntityId)
                .IsUnique();

            builder.Entity<Customer>()
                .HasIndex(c => new { c.TenantId, c.NormalizedCustomerNumber })
                .IsUnique();

            builder.Entity<Customer>()
                .HasIndex(c => new { c.TenantId, c.NormalizedCompanyName })
                .IsUnique();

            builder.Entity<ProductCategory>()
                .Property("Id")
                .HasColumnType("UUID")
                .HasDefaultValueSql(GENERATE_GUID)
                .ValueGeneratedOnAdd();

            builder.Entity<ProductCategory>()
                .Property("Created")
                .HasColumnType("TIMESTAMP")
                .HasDefaultValueSql(GET_UTC_TIMESTAMP)
                .ValueGeneratedOnAdd();

            builder.Entity<ProductCategory>()
                .HasIndex(pc => new { pc.TenantId, pc.NormalizedName })
                .IsUnique();

            builder.Entity<Product>()
                .Property("Id")
                .HasColumnType("UUID")
                .HasDefaultValueSql(GENERATE_GUID)
                .ValueGeneratedOnAdd();

            builder.Entity<Product>()
                .Property("Created")
                .HasColumnType("TIMESTAMP")
                .HasDefaultValueSql(GET_UTC_TIMESTAMP)
                .ValueGeneratedOnAdd();

            builder.Entity<Product>()
               .HasIndex(p => new { p.TenantId, p.NormalizedName })
               .IsUnique();

            builder.Entity<Product>()
               .HasIndex(p => new { p.TenantId, p.NormalizedSKU })
               .IsUnique();

            builder.Entity<TimeActivity>()
                .Property("Id")
                .HasColumnType("UUID")
                .HasDefaultValueSql(GENERATE_GUID)
                .ValueGeneratedOnAdd();

            builder.Entity<TimeActivity>()
                .Property("Created")
                .HasColumnType("TIMESTAMP")
                .HasDefaultValueSql(GET_UTC_TIMESTAMP)
                .ValueGeneratedOnAdd();

            builder.Entity<TimeActivity>()
                .HasIndex(t => new { t.TenantId, t.EmployeeId });

            builder.Entity<TimeActivity>()
                .HasIndex(t => new { t.TenantId, t.EmployeeId, t.Date });

            builder.Entity<TimeActivity>()
                .HasIndex(t => new { t.TenantId, t.CustomerId });

            builder.Entity<TimeActivity>()
                .HasIndex(t => new { t.TenantId, t.CustomerId, t.Date });

            builder.Entity<TimeActivity>()
                .HasIndex(t => new { t.TenantId, t.CustomerId, t.Date });

            builder.Entity<TimeActivity>()
                .HasIndex(t => new { t.TenantId, t.EmployeeId, t.CustomerId, t.Date });

            builder.Entity<InvoiceTerms>()
                .Property("Id")
                .HasColumnType("UUID")
                .HasDefaultValueSql(GENERATE_GUID)
                .ValueGeneratedOnAdd();

            builder.Entity<InvoiceTerms>()
                .Property("Created")
                .HasColumnType("TIMESTAMP")
                .HasDefaultValueSql(GET_UTC_TIMESTAMP)
                .ValueGeneratedOnAdd();

            builder.Entity<InvoiceTerms>()
                .HasIndex(it => it.TenantId)
                .HasFilter($"\"{nameof(Models.InvoiceTerms.TenantId)}\" IS NOT NULL");

            builder.Entity<InvoiceTerms>()
                .HasIndex(it => it.Name)
                .HasFilter($"\"{nameof(Models.InvoiceTerms.TenantId)}\" IS NULL")
                .IsUnique();

            builder.Entity<InvoiceTerms>()
                .HasIndex(it => new { it.Name, it.TenantId })
                .HasFilter($"\"{nameof(Models.InvoiceTerms.TenantId)}\" IS NOT NULL")
                .IsUnique();

            builder.Entity<Invoice>()
                .Property("Id")
                .HasColumnType("UUID")
                .HasDefaultValueSql(GENERATE_GUID)
                .ValueGeneratedOnAdd();

            builder.Entity<Invoice>()
                .Property("Created")
                .HasColumnType("TIMESTAMP")
                .HasDefaultValueSql(GET_UTC_TIMESTAMP)
                .ValueGeneratedOnAdd();

            builder.Entity<Invoice>()
                .HasIndex(i => new { i.TenantId, i.CustomerId });

            builder.Entity<Invoice>()
                .HasIndex(i => new { i.TenantId, i.InvoiceNumber })
                .IsUnique();

            builder.Entity<InvoiceLineItem>()
                .Property("Id")
                .HasColumnType("UUID")
                .HasDefaultValueSql(GENERATE_GUID)
                .ValueGeneratedOnAdd();

            builder.Entity<InvoiceLineItem>()
                .Property("Created")
                .HasColumnType("TIMESTAMP")
                .HasDefaultValueSql(GET_UTC_TIMESTAMP)
                .ValueGeneratedOnAdd();

            builder.Entity<InvoiceLineItem>()
                .HasIndex(ili => ili.InvoiceId);

            builder.Entity<InvoiceLineItemTimeActivity>()
                .HasKey(entity => new { entity.InvoiceLineItemId, entity.TimeActivityId });

            builder.Entity<InvoiceLineItemTimeActivity>()
                .HasIndex(entity => entity.InvoiceLineItemId)
                .IsUnique();

            builder.Entity<InvoiceLineItemTimeActivity>()
                .HasIndex(entity => entity.TimeActivityId)
                .IsUnique();

            builder.Entity<Payment>()
                .Property("Id")
                .HasColumnType("UUID")
                .HasDefaultValueSql(GENERATE_GUID)
                .ValueGeneratedOnAdd();

            builder.Entity<Payment>()
                .Property("Created")
                .HasColumnType("TIMESTAMP")
                .HasDefaultValueSql(GET_UTC_TIMESTAMP)
                .ValueGeneratedOnAdd();

            builder.Entity<Payment>()
                .HasIndex(p => new { p.TenantId, p.CustomerId });

            builder.Entity<InvoicePayment>()
                .HasKey(ip => new { ip.InvoiceId, ip.PaymentId });

            builder.Entity<InvoicePayment>()
                .HasIndex(ip => ip.InvoiceId);

            builder.Entity<InvoicePayment>()
                .HasIndex(ip => ip.PaymentId);
            #endregion Employee Time Tracking / Sales & Invoicing
        }

        private const string GENERATE_GUID = "gen_random_uuid()";
        private const string GET_UTC_TIMESTAMP = "now() AT TIME ZONE 'UTC'";
    }
}
