using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

namespace DashAccountingSystemV2.Data.Migrations
{
    public partial class AddCoreAccountingSchema : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AccountType",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    Name = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AccountType", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AssetType",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    Name = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AssetType", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Tenant",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "UUID", nullable: false, defaultValueSql: "uuid_in(overlay(overlay(md5(random()::text || ':' || clock_timestamp()::text) placing '4' from 13) placing to_hex(floor(random()*(11-8+1) + 8)::int)::text from 17)::cstring)"),
                    Name = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tenant", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Account",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "UUID", nullable: false, defaultValueSql: "uuid_in(overlay(overlay(md5(random()::text || ':' || clock_timestamp()::text) placing '4' from 13) placing to_hex(floor(random()*(11-8+1) + 8)::int)::text from 17)::cstring)"),
                    TenantId = table.Column<Guid>(type: "UUID", nullable: false),
                    AccountNumber = table.Column<int>(type: "integer", nullable: false),
                    Name = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    Description = table.Column<string>(type: "text", nullable: true),
                    AccountTypeId = table.Column<int>(type: "integer", nullable: false),
                    AssetTypeId = table.Column<int>(type: "integer", nullable: false),
                    NormalBalanceType = table.Column<short>(type: "smallint", nullable: false),
                    Created = table.Column<DateTime>(type: "TIMESTAMP", nullable: false, defaultValueSql: "now() AT TIME ZONE 'UTC'"),
                    CreatedById = table.Column<Guid>(type: "uuid", nullable: false),
                    Updated = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    UpdatedById = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Account", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Account_AccountType_AccountTypeId",
                        column: x => x.AccountTypeId,
                        principalTable: "AccountType",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Account_AspNetUsers_CreatedById",
                        column: x => x.CreatedById,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Account_AspNetUsers_UpdatedById",
                        column: x => x.UpdatedById,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Account_AssetType_AssetTypeId",
                        column: x => x.AssetTypeId,
                        principalTable: "AssetType",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Account_Tenant_TenantId",
                        column: x => x.TenantId,
                        principalTable: "Tenant",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "JournalEntry",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "UUID", nullable: false, defaultValueSql: "uuid_in(overlay(overlay(md5(random()::text || ':' || clock_timestamp()::text) placing '4' from 13) placing to_hex(floor(random()*(11-8+1) + 8)::int)::text from 17)::cstring)"),
                    TenantId = table.Column<Guid>(type: "UUID", nullable: false),
                    EntryId = table.Column<long>(type: "bigint", nullable: false),
                    EntryDate = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    PostDate = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    CancelDate = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    Status = table.Column<short>(type: "smallint", nullable: false),
                    Description = table.Column<string>(type: "character varying(2048)", maxLength: 2048, nullable: false),
                    CheckNumber = table.Column<long>(type: "bigint", nullable: true),
                    Note = table.Column<string>(type: "text", nullable: true),
                    Created = table.Column<DateTime>(type: "TIMESTAMP", nullable: false, defaultValueSql: "now() AT TIME ZONE 'UTC'"),
                    CreatedById = table.Column<Guid>(type: "uuid", nullable: false),
                    Updated = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    UpdatedById = table.Column<Guid>(type: "uuid", nullable: true),
                    PostedById = table.Column<Guid>(type: "uuid", nullable: true),
                    CanceledById = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_JournalEntry", x => x.Id);
                    table.ForeignKey(
                        name: "FK_JournalEntry_AspNetUsers_CanceledById",
                        column: x => x.CanceledById,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_JournalEntry_AspNetUsers_CreatedById",
                        column: x => x.CreatedById,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_JournalEntry_AspNetUsers_PostedById",
                        column: x => x.PostedById,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_JournalEntry_AspNetUsers_UpdatedById",
                        column: x => x.UpdatedById,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_JournalEntry_Tenant_TenantId",
                        column: x => x.TenantId,
                        principalTable: "Tenant",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ReconciliationReport",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "UUID", nullable: false, defaultValueSql: "uuid_in(overlay(overlay(md5(random()::text || ':' || clock_timestamp()::text) placing '4' from 13) placing to_hex(floor(random()*(11-8+1) + 8)::int)::text from 17)::cstring)"),
                    AccountId = table.Column<Guid>(type: "UUID", nullable: false),
                    Created = table.Column<DateTime>(type: "TIMESTAMP", nullable: false, defaultValueSql: "now() AT TIME ZONE 'UTC'"),
                    CreatedById = table.Column<Guid>(type: "uuid", nullable: false),
                    ClosingDate = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    ClosingBalance = table.Column<decimal>(type: "numeric", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ReconciliationReport", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ReconciliationReport_Account_AccountId",
                        column: x => x.AccountId,
                        principalTable: "Account",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ReconciliationReport_AspNetUsers_CreatedById",
                        column: x => x.CreatedById,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "JournalEntryAccount",
                columns: table => new
                {
                    JournalEntryId = table.Column<Guid>(type: "UUID", nullable: false),
                    AccountId = table.Column<Guid>(type: "UUID", nullable: false),
                    AssetTypeId = table.Column<int>(type: "integer", nullable: false),
                    Amount = table.Column<decimal>(type: "numeric", nullable: false),
                    ReconciliationReportId = table.Column<Guid>(type: "UUID", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_JournalEntryAccount", x => new { x.JournalEntryId, x.AccountId });
                    table.ForeignKey(
                        name: "FK_JournalEntryAccount_Account_AccountId",
                        column: x => x.AccountId,
                        principalTable: "Account",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_JournalEntryAccount_AssetType_AssetTypeId",
                        column: x => x.AssetTypeId,
                        principalTable: "AssetType",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_JournalEntryAccount_JournalEntry_JournalEntryId",
                        column: x => x.JournalEntryId,
                        principalTable: "JournalEntry",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_JournalEntryAccount_ReconciliationReport_ReconciliationRepo~",
                        column: x => x.ReconciliationReportId,
                        principalTable: "ReconciliationReport",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Account_AccountTypeId",
                table: "Account",
                column: "AccountTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_Account_AssetTypeId",
                table: "Account",
                column: "AssetTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_Account_CreatedById",
                table: "Account",
                column: "CreatedById");

            migrationBuilder.CreateIndex(
                name: "IX_Account_TenantId",
                table: "Account",
                column: "TenantId");

            migrationBuilder.CreateIndex(
                name: "IX_Account_TenantId_AccountNumber",
                table: "Account",
                columns: new[] { "TenantId", "AccountNumber" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Account_TenantId_Name",
                table: "Account",
                columns: new[] { "TenantId", "Name" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Account_UpdatedById",
                table: "Account",
                column: "UpdatedById");

            migrationBuilder.CreateIndex(
                name: "IX_AccountType_Name",
                table: "AccountType",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_AssetType_Name",
                table: "AssetType",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_JournalEntry_CanceledById",
                table: "JournalEntry",
                column: "CanceledById");

            migrationBuilder.CreateIndex(
                name: "IX_JournalEntry_CreatedById",
                table: "JournalEntry",
                column: "CreatedById");

            migrationBuilder.CreateIndex(
                name: "IX_JournalEntry_PostedById",
                table: "JournalEntry",
                column: "PostedById");

            migrationBuilder.CreateIndex(
                name: "IX_JournalEntry_TenantId",
                table: "JournalEntry",
                column: "TenantId");

            migrationBuilder.CreateIndex(
                name: "IX_JournalEntry_TenantId_EntryId",
                table: "JournalEntry",
                columns: new[] { "TenantId", "EntryId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_JournalEntry_UpdatedById",
                table: "JournalEntry",
                column: "UpdatedById");

            migrationBuilder.CreateIndex(
                name: "IX_JournalEntryAccount_AccountId",
                table: "JournalEntryAccount",
                column: "AccountId");

            migrationBuilder.CreateIndex(
                name: "IX_JournalEntryAccount_AssetTypeId",
                table: "JournalEntryAccount",
                column: "AssetTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_JournalEntryAccount_JournalEntryId",
                table: "JournalEntryAccount",
                column: "JournalEntryId");

            migrationBuilder.CreateIndex(
                name: "IX_JournalEntryAccount_ReconciliationReportId",
                table: "JournalEntryAccount",
                column: "ReconciliationReportId");

            migrationBuilder.CreateIndex(
                name: "IX_ReconciliationReport_AccountId",
                table: "ReconciliationReport",
                column: "AccountId");

            migrationBuilder.CreateIndex(
                name: "IX_ReconciliationReport_CreatedById",
                table: "ReconciliationReport",
                column: "CreatedById");

            migrationBuilder.CreateIndex(
                name: "IX_Tenant_Name",
                table: "Tenant",
                column: "Name",
                unique: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "JournalEntryAccount");

            migrationBuilder.DropTable(
                name: "JournalEntry");

            migrationBuilder.DropTable(
                name: "ReconciliationReport");

            migrationBuilder.DropTable(
                name: "Account");

            migrationBuilder.DropTable(
                name: "AccountType");

            migrationBuilder.DropTable(
                name: "AssetType");

            migrationBuilder.DropTable(
                name: "Tenant");
        }
    }
}
