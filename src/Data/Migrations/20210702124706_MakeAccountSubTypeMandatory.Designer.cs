﻿// <auto-generated />
using System;
using DashAccountingSystemV2.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

namespace DashAccountingSystemV2.Data.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    [Migration("20210702124706_MakeAccountSubTypeMandatory")]
    partial class MakeAccountSubTypeMandatory
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .UseSerialColumns()
                .HasAnnotation("Relational:MaxIdentifierLength", 63)
                .HasAnnotation("ProductVersion", "5.0.1");

            modelBuilder.Entity("DashAccountingSystemV2.Models.Account", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("UUID")
                        .HasDefaultValueSql("uuid_in(overlay(overlay(md5(random()::text || ':' || clock_timestamp()::text) placing '4' from 13) placing to_hex(floor(random()*(11-8+1) + 8)::int)::text from 17)::cstring)");

                    b.Property<int>("AccountNumber")
                        .HasColumnType("integer");

                    b.Property<int>("AccountSubTypeId")
                        .HasColumnType("integer");

                    b.Property<int>("AccountTypeId")
                        .HasColumnType("integer");

                    b.Property<int>("AssetTypeId")
                        .HasColumnType("integer");

                    b.Property<DateTime>("Created")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("TIMESTAMP")
                        .HasDefaultValueSql("now() AT TIME ZONE 'UTC'");

                    b.Property<Guid>("CreatedById")
                        .HasColumnType("uuid");

                    b.Property<string>("Description")
                        .HasColumnType("text");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(255)
                        .HasColumnType("character varying(255)");

                    b.Property<short>("NormalBalanceType")
                        .HasColumnType("smallint");

                    b.Property<Guid>("TenantId")
                        .HasColumnType("UUID");

                    b.Property<DateTime?>("Updated")
                        .HasColumnType("timestamp without time zone");

                    b.Property<Guid?>("UpdatedById")
                        .HasColumnType("uuid");

                    b.HasKey("Id");

                    b.HasIndex("AccountSubTypeId");

                    b.HasIndex("AccountTypeId");

                    b.HasIndex("AssetTypeId");

                    b.HasIndex("CreatedById");

                    b.HasIndex("TenantId");

                    b.HasIndex("UpdatedById");

                    b.HasIndex("TenantId", "AccountNumber")
                        .IsUnique();

                    b.HasIndex("TenantId", "Name")
                        .IsUnique();

                    b.ToTable("Account");
                });

            modelBuilder.Entity("DashAccountingSystemV2.Models.AccountSubType", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer")
                        .UseSerialColumn();

                    b.Property<int>("AccountTypeId")
                        .HasColumnType("integer");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(255)
                        .HasColumnType("character varying(255)");

                    b.HasKey("Id");

                    b.HasIndex("AccountTypeId");

                    b.HasIndex("Name")
                        .IsUnique();

                    b.ToTable("AccountSubType");
                });

            modelBuilder.Entity("DashAccountingSystemV2.Models.AccountType", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer")
                        .UseSerialColumn();

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(255)
                        .HasColumnType("character varying(255)");

                    b.HasKey("Id");

                    b.HasIndex("Name")
                        .IsUnique();

                    b.ToTable("AccountType");
                });

            modelBuilder.Entity("DashAccountingSystemV2.Models.ApplicationRole", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<string>("ConcurrencyStamp")
                        .IsConcurrencyToken()
                        .HasColumnType("text");

                    b.Property<string>("Description")
                        .HasColumnType("text");

                    b.Property<string>("Name")
                        .HasMaxLength(256)
                        .HasColumnType("character varying(256)");

                    b.Property<string>("NormalizedName")
                        .HasMaxLength(256)
                        .HasColumnType("character varying(256)");

                    b.HasKey("Id");

                    b.HasIndex("NormalizedName")
                        .IsUnique()
                        .HasDatabaseName("RoleNameIndex");

                    b.ToTable("AspNetRoles");
                });

            modelBuilder.Entity("DashAccountingSystemV2.Models.ApplicationUser", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<int>("AccessFailedCount")
                        .HasColumnType("integer");

                    b.Property<string>("ConcurrencyStamp")
                        .IsConcurrencyToken()
                        .HasColumnType("text");

                    b.Property<string>("Email")
                        .HasMaxLength(256)
                        .HasColumnType("character varying(256)");

                    b.Property<bool>("EmailConfirmed")
                        .HasColumnType("boolean");

                    b.Property<DateTime?>("EmailConfirmedDate")
                        .HasColumnType("timestamp without time zone");

                    b.Property<string>("FirstName")
                        .IsRequired()
                        .HasMaxLength(70)
                        .HasColumnType("character varying(70)");

                    b.Property<string>("LastName")
                        .IsRequired()
                        .HasMaxLength(70)
                        .HasColumnType("character varying(70)");

                    b.Property<bool>("LockoutEnabled")
                        .HasColumnType("boolean");

                    b.Property<DateTimeOffset?>("LockoutEnd")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("NormalizedEmail")
                        .HasMaxLength(256)
                        .HasColumnType("character varying(256)");

                    b.Property<string>("NormalizedUserName")
                        .HasMaxLength(256)
                        .HasColumnType("character varying(256)");

                    b.Property<string>("PasswordHash")
                        .HasColumnType("text");

                    b.Property<DateTime?>("PhoneConfirmedDate")
                        .HasColumnType("timestamp without time zone");

                    b.Property<string>("PhoneNumber")
                        .HasColumnType("text");

                    b.Property<bool>("PhoneNumberConfirmed")
                        .HasColumnType("boolean");

                    b.Property<string>("SecurityStamp")
                        .HasColumnType("text");

                    b.Property<bool>("TwoFactorEnabled")
                        .HasColumnType("boolean");

                    b.Property<string>("UserName")
                        .HasMaxLength(256)
                        .HasColumnType("character varying(256)");

                    b.HasKey("Id");

                    b.HasIndex("NormalizedEmail")
                        .HasDatabaseName("EmailIndex");

                    b.HasIndex("NormalizedUserName")
                        .IsUnique()
                        .HasDatabaseName("UserNameIndex");

                    b.ToTable("AspNetUsers");
                });

            modelBuilder.Entity("DashAccountingSystemV2.Models.AssetType", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer")
                        .UseSerialColumn();

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(255)
                        .HasColumnType("character varying(255)");

                    b.Property<char?>("Symbol")
                        .HasColumnType("character(1)");

                    b.HasKey("Id");

                    b.HasIndex("Name")
                        .IsUnique();

                    b.ToTable("AssetType");
                });

            modelBuilder.Entity("DashAccountingSystemV2.Models.JournalEntry", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("UUID")
                        .HasDefaultValueSql("uuid_in(overlay(overlay(md5(random()::text || ':' || clock_timestamp()::text) placing '4' from 13) placing to_hex(floor(random()*(11-8+1) + 8)::int)::text from 17)::cstring)");

                    b.Property<long?>("CheckNumber")
                        .HasColumnType("bigint");

                    b.Property<DateTime>("Created")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("TIMESTAMP")
                        .HasDefaultValueSql("now() AT TIME ZONE 'UTC'");

                    b.Property<Guid>("CreatedById")
                        .HasColumnType("uuid");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasMaxLength(2048)
                        .HasColumnType("character varying(2048)");

                    b.Property<DateTime>("EntryDate")
                        .HasColumnType("timestamp without time zone");

                    b.Property<long>("EntryId")
                        .HasColumnType("bigint");

                    b.Property<string>("Note")
                        .HasColumnType("text");

                    b.Property<DateTime?>("PostDate")
                        .HasColumnType("timestamp without time zone");

                    b.Property<Guid?>("PostedById")
                        .HasColumnType("uuid");

                    b.Property<short>("Status")
                        .HasColumnType("smallint");

                    b.Property<Guid>("TenantId")
                        .HasColumnType("UUID");

                    b.Property<DateTime?>("Updated")
                        .HasColumnType("timestamp without time zone");

                    b.Property<Guid?>("UpdatedById")
                        .HasColumnType("uuid");

                    b.HasKey("Id");

                    b.HasIndex("CreatedById");

                    b.HasIndex("PostedById");

                    b.HasIndex("TenantId");

                    b.HasIndex("UpdatedById");

                    b.HasIndex("TenantId", "EntryId")
                        .IsUnique();

                    b.ToTable("JournalEntry");
                });

            modelBuilder.Entity("DashAccountingSystemV2.Models.JournalEntryAccount", b =>
                {
                    b.Property<Guid>("JournalEntryId")
                        .HasColumnType("UUID");

                    b.Property<Guid>("AccountId")
                        .HasColumnType("UUID");

                    b.Property<decimal>("Amount")
                        .HasColumnType("numeric");

                    b.Property<int>("AssetTypeId")
                        .HasColumnType("integer");

                    b.Property<Guid?>("ReconciliationReportId")
                        .HasColumnType("UUID");

                    b.HasKey("JournalEntryId", "AccountId");

                    b.HasIndex("AccountId");

                    b.HasIndex("AssetTypeId");

                    b.HasIndex("JournalEntryId");

                    b.HasIndex("ReconciliationReportId");

                    b.ToTable("JournalEntryAccount");
                });

            modelBuilder.Entity("DashAccountingSystemV2.Models.ReconciliationReport", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("UUID")
                        .HasDefaultValueSql("uuid_in(overlay(overlay(md5(random()::text || ':' || clock_timestamp()::text) placing '4' from 13) placing to_hex(floor(random()*(11-8+1) + 8)::int)::text from 17)::cstring)");

                    b.Property<Guid>("AccountId")
                        .HasColumnType("UUID");

                    b.Property<decimal>("ClosingBalance")
                        .HasColumnType("numeric");

                    b.Property<DateTime>("ClosingDate")
                        .HasColumnType("timestamp without time zone");

                    b.Property<DateTime>("Created")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("TIMESTAMP")
                        .HasDefaultValueSql("now() AT TIME ZONE 'UTC'");

                    b.Property<Guid>("CreatedById")
                        .HasColumnType("uuid");

                    b.HasKey("Id");

                    b.HasIndex("AccountId");

                    b.HasIndex("CreatedById");

                    b.ToTable("ReconciliationReport");
                });

            modelBuilder.Entity("DashAccountingSystemV2.Models.Tenant", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("UUID")
                        .HasDefaultValueSql("uuid_in(overlay(overlay(md5(random()::text || ':' || clock_timestamp()::text) placing '4' from 13) placing to_hex(floor(random()*(11-8+1) + 8)::int)::text from 17)::cstring)");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(255)
                        .HasColumnType("character varying(255)");

                    b.HasKey("Id");

                    b.HasIndex("Name")
                        .IsUnique();

                    b.ToTable("Tenant");
                });

            modelBuilder.Entity("IdentityServer4.EntityFramework.Entities.DeviceFlowCodes", b =>
                {
                    b.Property<string>("UserCode")
                        .HasMaxLength(200)
                        .HasColumnType("character varying(200)");

                    b.Property<string>("ClientId")
                        .IsRequired()
                        .HasMaxLength(200)
                        .HasColumnType("character varying(200)");

                    b.Property<DateTime>("CreationTime")
                        .HasColumnType("timestamp without time zone");

                    b.Property<string>("Data")
                        .IsRequired()
                        .HasMaxLength(50000)
                        .HasColumnType("character varying(50000)");

                    b.Property<string>("Description")
                        .HasMaxLength(200)
                        .HasColumnType("character varying(200)");

                    b.Property<string>("DeviceCode")
                        .IsRequired()
                        .HasMaxLength(200)
                        .HasColumnType("character varying(200)");

                    b.Property<DateTime?>("Expiration")
                        .IsRequired()
                        .HasColumnType("timestamp without time zone");

                    b.Property<string>("SessionId")
                        .HasMaxLength(100)
                        .HasColumnType("character varying(100)");

                    b.Property<string>("SubjectId")
                        .HasMaxLength(200)
                        .HasColumnType("character varying(200)");

                    b.HasKey("UserCode");

                    b.HasIndex("DeviceCode")
                        .IsUnique();

                    b.HasIndex("Expiration");

                    b.ToTable("DeviceCodes");
                });

            modelBuilder.Entity("IdentityServer4.EntityFramework.Entities.PersistedGrant", b =>
                {
                    b.Property<string>("Key")
                        .HasMaxLength(200)
                        .HasColumnType("character varying(200)");

                    b.Property<string>("ClientId")
                        .IsRequired()
                        .HasMaxLength(200)
                        .HasColumnType("character varying(200)");

                    b.Property<DateTime?>("ConsumedTime")
                        .HasColumnType("timestamp without time zone");

                    b.Property<DateTime>("CreationTime")
                        .HasColumnType("timestamp without time zone");

                    b.Property<string>("Data")
                        .IsRequired()
                        .HasMaxLength(50000)
                        .HasColumnType("character varying(50000)");

                    b.Property<string>("Description")
                        .HasMaxLength(200)
                        .HasColumnType("character varying(200)");

                    b.Property<DateTime?>("Expiration")
                        .HasColumnType("timestamp without time zone");

                    b.Property<string>("SessionId")
                        .HasMaxLength(100)
                        .HasColumnType("character varying(100)");

                    b.Property<string>("SubjectId")
                        .HasMaxLength(200)
                        .HasColumnType("character varying(200)");

                    b.Property<string>("Type")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("character varying(50)");

                    b.HasKey("Key");

                    b.HasIndex("Expiration");

                    b.HasIndex("SubjectId", "ClientId", "Type");

                    b.HasIndex("SubjectId", "SessionId", "Type");

                    b.ToTable("PersistedGrants");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityRoleClaim<System.Guid>", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer")
                        .UseSerialColumn();

                    b.Property<string>("ClaimType")
                        .HasColumnType("text");

                    b.Property<string>("ClaimValue")
                        .HasColumnType("text");

                    b.Property<Guid>("RoleId")
                        .HasColumnType("uuid");

                    b.HasKey("Id");

                    b.HasIndex("RoleId");

                    b.ToTable("AspNetRoleClaims");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserClaim<System.Guid>", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer")
                        .UseSerialColumn();

                    b.Property<string>("ClaimType")
                        .HasColumnType("text");

                    b.Property<string>("ClaimValue")
                        .HasColumnType("text");

                    b.Property<Guid>("UserId")
                        .HasColumnType("uuid");

                    b.HasKey("Id");

                    b.HasIndex("UserId");

                    b.ToTable("AspNetUserClaims");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserLogin<System.Guid>", b =>
                {
                    b.Property<string>("LoginProvider")
                        .HasMaxLength(128)
                        .HasColumnType("character varying(128)");

                    b.Property<string>("ProviderKey")
                        .HasMaxLength(128)
                        .HasColumnType("character varying(128)");

                    b.Property<string>("ProviderDisplayName")
                        .HasColumnType("text");

                    b.Property<Guid>("UserId")
                        .HasColumnType("uuid");

                    b.HasKey("LoginProvider", "ProviderKey");

                    b.HasIndex("UserId");

                    b.ToTable("AspNetUserLogins");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserRole<System.Guid>", b =>
                {
                    b.Property<Guid>("UserId")
                        .HasColumnType("uuid");

                    b.Property<Guid>("RoleId")
                        .HasColumnType("uuid");

                    b.HasKey("UserId", "RoleId");

                    b.HasIndex("RoleId");

                    b.ToTable("AspNetUserRoles");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserToken<System.Guid>", b =>
                {
                    b.Property<Guid>("UserId")
                        .HasColumnType("uuid");

                    b.Property<string>("LoginProvider")
                        .HasMaxLength(128)
                        .HasColumnType("character varying(128)");

                    b.Property<string>("Name")
                        .HasMaxLength(128)
                        .HasColumnType("character varying(128)");

                    b.Property<string>("Value")
                        .HasColumnType("text");

                    b.HasKey("UserId", "LoginProvider", "Name");

                    b.ToTable("AspNetUserTokens");
                });

            modelBuilder.Entity("DashAccountingSystemV2.Models.Account", b =>
                {
                    b.HasOne("DashAccountingSystemV2.Models.AccountSubType", "AccountSubType")
                        .WithMany()
                        .HasForeignKey("AccountSubTypeId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("DashAccountingSystemV2.Models.AccountType", "AccountType")
                        .WithMany()
                        .HasForeignKey("AccountTypeId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("DashAccountingSystemV2.Models.AssetType", "AssetType")
                        .WithMany()
                        .HasForeignKey("AssetTypeId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("DashAccountingSystemV2.Models.ApplicationUser", "CreatedBy")
                        .WithMany()
                        .HasForeignKey("CreatedById")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("DashAccountingSystemV2.Models.Tenant", "Tenant")
                        .WithMany("Accounts")
                        .HasForeignKey("TenantId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("DashAccountingSystemV2.Models.ApplicationUser", "UpdatedBy")
                        .WithMany()
                        .HasForeignKey("UpdatedById");

                    b.Navigation("AccountSubType");

                    b.Navigation("AccountType");

                    b.Navigation("AssetType");

                    b.Navigation("CreatedBy");

                    b.Navigation("Tenant");

                    b.Navigation("UpdatedBy");
                });

            modelBuilder.Entity("DashAccountingSystemV2.Models.AccountSubType", b =>
                {
                    b.HasOne("DashAccountingSystemV2.Models.AccountType", "AccountType")
                        .WithMany()
                        .HasForeignKey("AccountTypeId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("AccountType");
                });

            modelBuilder.Entity("DashAccountingSystemV2.Models.JournalEntry", b =>
                {
                    b.HasOne("DashAccountingSystemV2.Models.ApplicationUser", "CreatedBy")
                        .WithMany()
                        .HasForeignKey("CreatedById")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("DashAccountingSystemV2.Models.ApplicationUser", "PostedBy")
                        .WithMany()
                        .HasForeignKey("PostedById");

                    b.HasOne("DashAccountingSystemV2.Models.Tenant", "Tenant")
                        .WithMany("JournalEntries")
                        .HasForeignKey("TenantId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("DashAccountingSystemV2.Models.ApplicationUser", "UpdatedBy")
                        .WithMany()
                        .HasForeignKey("UpdatedById");

                    b.Navigation("CreatedBy");

                    b.Navigation("PostedBy");

                    b.Navigation("Tenant");

                    b.Navigation("UpdatedBy");
                });

            modelBuilder.Entity("DashAccountingSystemV2.Models.JournalEntryAccount", b =>
                {
                    b.HasOne("DashAccountingSystemV2.Models.Account", "Account")
                        .WithMany()
                        .HasForeignKey("AccountId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("DashAccountingSystemV2.Models.AssetType", "AssetType")
                        .WithMany()
                        .HasForeignKey("AssetTypeId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("DashAccountingSystemV2.Models.JournalEntry", "JournalEntry")
                        .WithMany("Accounts")
                        .HasForeignKey("JournalEntryId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("DashAccountingSystemV2.Models.ReconciliationReport", "ReconciliationReport")
                        .WithMany("Transactions")
                        .HasForeignKey("ReconciliationReportId");

                    b.Navigation("Account");

                    b.Navigation("AssetType");

                    b.Navigation("JournalEntry");

                    b.Navigation("ReconciliationReport");
                });

            modelBuilder.Entity("DashAccountingSystemV2.Models.ReconciliationReport", b =>
                {
                    b.HasOne("DashAccountingSystemV2.Models.Account", "Account")
                        .WithMany("ReconciliationReports")
                        .HasForeignKey("AccountId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("DashAccountingSystemV2.Models.ApplicationUser", "CreatedBy")
                        .WithMany()
                        .HasForeignKey("CreatedById")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Account");

                    b.Navigation("CreatedBy");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityRoleClaim<System.Guid>", b =>
                {
                    b.HasOne("DashAccountingSystemV2.Models.ApplicationRole", null)
                        .WithMany()
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserClaim<System.Guid>", b =>
                {
                    b.HasOne("DashAccountingSystemV2.Models.ApplicationUser", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserLogin<System.Guid>", b =>
                {
                    b.HasOne("DashAccountingSystemV2.Models.ApplicationUser", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserRole<System.Guid>", b =>
                {
                    b.HasOne("DashAccountingSystemV2.Models.ApplicationRole", null)
                        .WithMany()
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("DashAccountingSystemV2.Models.ApplicationUser", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserToken<System.Guid>", b =>
                {
                    b.HasOne("DashAccountingSystemV2.Models.ApplicationUser", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("DashAccountingSystemV2.Models.Account", b =>
                {
                    b.Navigation("ReconciliationReports");
                });

            modelBuilder.Entity("DashAccountingSystemV2.Models.JournalEntry", b =>
                {
                    b.Navigation("Accounts");
                });

            modelBuilder.Entity("DashAccountingSystemV2.Models.ReconciliationReport", b =>
                {
                    b.Navigation("Transactions");
                });

            modelBuilder.Entity("DashAccountingSystemV2.Models.Tenant", b =>
                {
                    b.Navigation("Accounts");

                    b.Navigation("JournalEntries");
                });
#pragma warning restore 612, 618
        }
    }
}
