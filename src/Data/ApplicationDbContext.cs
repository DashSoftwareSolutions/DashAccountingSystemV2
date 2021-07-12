using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using IdentityServer4.EntityFramework.Entities;
using IdentityServer4.EntityFramework.Extensions;
using IdentityServer4.EntityFramework.Interfaces;
using IdentityServer4.EntityFramework.Options;
using DashAccountingSystemV2.Models;

namespace DashAccountingSystemV2.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser, ApplicationRole, Guid>, IPersistedGrantDbContext
    {
        private readonly IOptions<OperationalStoreOptions> _operationalStoreOptions;

        public ApplicationDbContext(
            DbContextOptions options,
            IOptions<OperationalStoreOptions> operationalStoreOptions)
            : base(options)
        {
            _operationalStoreOptions = operationalStoreOptions;
        }

        #region Main Application Schema
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
        #endregion Employee Time Tracking / Sales & Invoicing

        #endregion Main Application Schema

        #region Persisted Grants for Identity Server
        /// <summary>
        /// Gets or sets the <see cref="DbSet{PersistedGrant}"/>.
        /// </summary>
        public DbSet<PersistedGrant> PersistedGrants { get; set; }

        /// <summary>
        /// Gets or sets the <see cref="DbSet{DeviceFlowCodes}"/>.
        /// </summary>
        public DbSet<DeviceFlowCodes> DeviceFlowCodes { get; set; }
        #endregion Persisted Grants for Identity Server

        Task<int> IPersistedGrantDbContext.SaveChangesAsync() => base.SaveChangesAsync();

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // Persisted Grants for Identity Server
            builder.ConfigurePersistedGrantContext(_operationalStoreOptions.Value);

            // Main Application Schema (Indexes and Such)
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
                .Property(a => a.AddressType)
                .HasMaxLength(32)
                .HasConversion(
                    v => v.ToString(),
                    v => Enum.Parse<AddressType>(v));

            builder.Entity<Employee>()
                .HasIndex(e => e.EntityId)
                .IsUnique();

            #endregion Employee Time Tracking / Sales & Invoicing
        }

        private const string GENERATE_GUID = "uuid_in(overlay(overlay(md5(random()::text || ':' || clock_timestamp()::text) placing '4' from 13) placing to_hex(floor(random()*(11-8+1) + 8)::int)::text from 17)::cstring)";
        private const string GET_UTC_TIMESTAMP = "now() AT TIME ZONE 'UTC'";
    }
}
