using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

namespace DashAccountingSystemV2.Data.Migrations
{
    public partial class InvoicingAndPayments : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "InvoiceLineItemId",
                table: "TimeActivity",
                type: "UUID",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "InvoiceTerms",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "UUID", nullable: false, defaultValueSql: "uuid_in(overlay(overlay(md5(random()::text || ':' || clock_timestamp()::text) placing '4' from 13) placing to_hex(floor(random()*(11-8+1) + 8)::int)::text from 17)::cstring)"),
                    TenantId = table.Column<Guid>(type: "uuid", nullable: true),
                    Name = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false),
                    DueInDays = table.Column<int>(type: "integer", nullable: true),
                    DueOnDayOfMonth = table.Column<int>(type: "integer", nullable: true),
                    DueNextMonthThreshold = table.Column<int>(type: "integer", nullable: true),
                    Created = table.Column<DateTime>(type: "TIMESTAMP", nullable: false, defaultValueSql: "now() AT TIME ZONE 'UTC'"),
                    CreatedById = table.Column<Guid>(type: "uuid", nullable: false),
                    Updated = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    UpdatedById = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_InvoiceTerms", x => x.Id);
                    table.ForeignKey(
                        name: "FK_InvoiceTerms_AspNetUsers_CreatedById",
                        column: x => x.CreatedById,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_InvoiceTerms_AspNetUsers_UpdatedById",
                        column: x => x.UpdatedById,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "PaymentMethod",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    Name = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PaymentMethod", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Payment",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "UUID", nullable: false, defaultValueSql: "uuid_in(overlay(overlay(md5(random()::text || ':' || clock_timestamp()::text) placing '4' from 13) placing to_hex(floor(random()*(11-8+1) + 8)::int)::text from 17)::cstring)"),
                    TenantId = table.Column<Guid>(type: "UUID", nullable: false),
                    CustomerId = table.Column<Guid>(type: "UUID", nullable: false),
                    DepositAccountId = table.Column<Guid>(type: "UUID", nullable: false),
                    PaymentMethodId = table.Column<int>(type: "integer", nullable: false),
                    Date = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    Amount = table.Column<decimal>(type: "numeric", nullable: false),
                    AssetTypeId = table.Column<int>(type: "integer", nullable: false),
                    JournalEntryId = table.Column<Guid>(type: "UUID", nullable: false),
                    Created = table.Column<DateTime>(type: "TIMESTAMP", nullable: false, defaultValueSql: "now() AT TIME ZONE 'UTC'"),
                    CreatedById = table.Column<Guid>(type: "uuid", nullable: false),
                    Updated = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    UpdatedById = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Payment", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Payment_Account_DepositAccountId",
                        column: x => x.DepositAccountId,
                        principalTable: "Account",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Payment_AspNetUsers_CreatedById",
                        column: x => x.CreatedById,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Payment_AspNetUsers_UpdatedById",
                        column: x => x.UpdatedById,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Payment_AssetType_AssetTypeId",
                        column: x => x.AssetTypeId,
                        principalTable: "AssetType",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Payment_Customer_CustomerId",
                        column: x => x.CustomerId,
                        principalTable: "Customer",
                        principalColumn: "EntityId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Payment_JournalEntry_JournalEntryId",
                        column: x => x.JournalEntryId,
                        principalTable: "JournalEntry",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Payment_PaymentMethod_PaymentMethodId",
                        column: x => x.PaymentMethodId,
                        principalTable: "PaymentMethod",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Payment_Tenant_TenantId",
                        column: x => x.TenantId,
                        principalTable: "Tenant",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Invoice",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "UUID", nullable: false, defaultValueSql: "uuid_in(overlay(overlay(md5(random()::text || ':' || clock_timestamp()::text) placing '4' from 13) placing to_hex(floor(random()*(11-8+1) + 8)::int)::text from 17)::cstring)"),
                    TenantId = table.Column<Guid>(type: "UUID", nullable: false),
                    InvoiceNumber = table.Column<long>(type: "bigint", nullable: false),
                    Status = table.Column<short>(type: "smallint", nullable: false),
                    CustomerId = table.Column<Guid>(type: "UUID", nullable: false),
                    CustomrEmail = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    CustomerAddress = table.Column<string>(type: "character varying(2048)", maxLength: 2048, nullable: true),
                    InvoiceTermsId = table.Column<Guid>(type: "UUID", nullable: false),
                    IssueDate = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    DueDate = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    Message = table.Column<string>(type: "character varying(2048)", maxLength: 2048, nullable: true),
                    PaymentId = table.Column<Guid>(type: "UUID", nullable: true),
                    Created = table.Column<DateTime>(type: "TIMESTAMP", nullable: false, defaultValueSql: "now() AT TIME ZONE 'UTC'"),
                    CreatedById = table.Column<Guid>(type: "uuid", nullable: false),
                    Updated = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    UpdatedById = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Invoice", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Invoice_AspNetUsers_CreatedById",
                        column: x => x.CreatedById,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Invoice_AspNetUsers_UpdatedById",
                        column: x => x.UpdatedById,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Invoice_Customer_CustomerId",
                        column: x => x.CustomerId,
                        principalTable: "Customer",
                        principalColumn: "EntityId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Invoice_InvoiceTerms_InvoiceTermsId",
                        column: x => x.InvoiceTermsId,
                        principalTable: "InvoiceTerms",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Invoice_Payment_PaymentId",
                        column: x => x.PaymentId,
                        principalTable: "Payment",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Invoice_Tenant_TenantId",
                        column: x => x.TenantId,
                        principalTable: "Tenant",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "InvoiceLineItem",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "UUID", nullable: false, defaultValueSql: "uuid_in(overlay(overlay(md5(random()::text || ':' || clock_timestamp()::text) placing '4' from 13) placing to_hex(floor(random()*(11-8+1) + 8)::int)::text from 17)::cstring)"),
                    InvoiceId = table.Column<Guid>(type: "UUID", nullable: false),
                    OrderNumber = table.Column<int>(type: "integer", nullable: false),
                    Date = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    ProductId = table.Column<Guid>(type: "UUID", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false),
                    Quantity = table.Column<decimal>(type: "numeric", nullable: false),
                    UnitPrice = table.Column<decimal>(type: "numeric", nullable: false),
                    Total = table.Column<decimal>(type: "numeric", nullable: false),
                    AssetTypeId = table.Column<int>(type: "integer", nullable: false),
                    Created = table.Column<DateTime>(type: "TIMESTAMP", nullable: false, defaultValueSql: "now() AT TIME ZONE 'UTC'"),
                    CreatedById = table.Column<Guid>(type: "uuid", nullable: false),
                    Updated = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    UpdatedById = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_InvoiceLineItem", x => x.Id);
                    table.ForeignKey(
                        name: "FK_InvoiceLineItem_AspNetUsers_CreatedById",
                        column: x => x.CreatedById,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_InvoiceLineItem_AspNetUsers_UpdatedById",
                        column: x => x.UpdatedById,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_InvoiceLineItem_AssetType_AssetTypeId",
                        column: x => x.AssetTypeId,
                        principalTable: "AssetType",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_InvoiceLineItem_Invoice_InvoiceId",
                        column: x => x.InvoiceId,
                        principalTable: "Invoice",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_InvoiceLineItem_Product_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Product",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_TimeActivity_InvoiceLineItemId",
                table: "TimeActivity",
                column: "InvoiceLineItemId");

            migrationBuilder.CreateIndex(
                name: "IX_Invoice_CreatedById",
                table: "Invoice",
                column: "CreatedById");

            migrationBuilder.CreateIndex(
                name: "IX_Invoice_CustomerId",
                table: "Invoice",
                column: "CustomerId");

            migrationBuilder.CreateIndex(
                name: "IX_Invoice_InvoiceTermsId",
                table: "Invoice",
                column: "InvoiceTermsId");

            migrationBuilder.CreateIndex(
                name: "IX_Invoice_PaymentId",
                table: "Invoice",
                column: "PaymentId");

            migrationBuilder.CreateIndex(
                name: "IX_Invoice_TenantId_CustomerId",
                table: "Invoice",
                columns: new[] { "TenantId", "CustomerId" });

            migrationBuilder.CreateIndex(
                name: "IX_Invoice_UpdatedById",
                table: "Invoice",
                column: "UpdatedById");

            migrationBuilder.CreateIndex(
                name: "IX_InvoiceLineItem_AssetTypeId",
                table: "InvoiceLineItem",
                column: "AssetTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_InvoiceLineItem_CreatedById",
                table: "InvoiceLineItem",
                column: "CreatedById");

            migrationBuilder.CreateIndex(
                name: "IX_InvoiceLineItem_InvoiceId",
                table: "InvoiceLineItem",
                column: "InvoiceId");

            migrationBuilder.CreateIndex(
                name: "IX_InvoiceLineItem_ProductId",
                table: "InvoiceLineItem",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_InvoiceLineItem_UpdatedById",
                table: "InvoiceLineItem",
                column: "UpdatedById");

            migrationBuilder.CreateIndex(
                name: "IX_InvoiceTerms_CreatedById",
                table: "InvoiceTerms",
                column: "CreatedById");

            migrationBuilder.CreateIndex(
                name: "IX_InvoiceTerms_TenantId",
                table: "InvoiceTerms",
                column: "TenantId",
                filter: "\"TenantId\" IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_InvoiceTerms_UpdatedById",
                table: "InvoiceTerms",
                column: "UpdatedById");

            migrationBuilder.CreateIndex(
                name: "IX_Payment_AssetTypeId",
                table: "Payment",
                column: "AssetTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_Payment_CreatedById",
                table: "Payment",
                column: "CreatedById");

            migrationBuilder.CreateIndex(
                name: "IX_Payment_CustomerId",
                table: "Payment",
                column: "CustomerId");

            migrationBuilder.CreateIndex(
                name: "IX_Payment_DepositAccountId",
                table: "Payment",
                column: "DepositAccountId");

            migrationBuilder.CreateIndex(
                name: "IX_Payment_JournalEntryId",
                table: "Payment",
                column: "JournalEntryId");

            migrationBuilder.CreateIndex(
                name: "IX_Payment_PaymentMethodId",
                table: "Payment",
                column: "PaymentMethodId");

            migrationBuilder.CreateIndex(
                name: "IX_Payment_TenantId_CustomerId",
                table: "Payment",
                columns: new[] { "TenantId", "CustomerId" });

            migrationBuilder.CreateIndex(
                name: "IX_Payment_UpdatedById",
                table: "Payment",
                column: "UpdatedById");

            migrationBuilder.AddForeignKey(
                name: "FK_TimeActivity_InvoiceLineItem_InvoiceLineItemId",
                table: "TimeActivity",
                column: "InvoiceLineItemId",
                principalTable: "InvoiceLineItem",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TimeActivity_InvoiceLineItem_InvoiceLineItemId",
                table: "TimeActivity");

            migrationBuilder.DropTable(
                name: "InvoiceLineItem");

            migrationBuilder.DropTable(
                name: "Invoice");

            migrationBuilder.DropTable(
                name: "InvoiceTerms");

            migrationBuilder.DropTable(
                name: "Payment");

            migrationBuilder.DropTable(
                name: "PaymentMethod");

            migrationBuilder.DropIndex(
                name: "IX_TimeActivity_InvoiceLineItemId",
                table: "TimeActivity");

            migrationBuilder.DropColumn(
                name: "InvoiceLineItemId",
                table: "TimeActivity");
        }
    }
}
