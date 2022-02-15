using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace DashAccountingSystemV2.Data.Migrations
{
    public partial class InvoiceTermsUpdates : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<Guid>(
                name: "TenantId",
                table: "InvoiceTerms",
                type: "UUID",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uuid",
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_InvoiceTerms_Name",
                table: "InvoiceTerms",
                column: "Name",
                unique: true,
                filter: "\"TenantId\" IS NULL");

            migrationBuilder.CreateIndex(
                name: "IX_InvoiceTerms_Name_TenantId",
                table: "InvoiceTerms",
                columns: new[] { "Name", "TenantId" },
                unique: true,
                filter: "\"TenantId\" IS NOT NULL");

            migrationBuilder.AddForeignKey(
                name: "FK_InvoiceTerms_Tenant_TenantId",
                table: "InvoiceTerms",
                column: "TenantId",
                principalTable: "Tenant",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_InvoiceTerms_Tenant_TenantId",
                table: "InvoiceTerms");

            migrationBuilder.DropIndex(
                name: "IX_InvoiceTerms_Name",
                table: "InvoiceTerms");

            migrationBuilder.DropIndex(
                name: "IX_InvoiceTerms_Name_TenantId",
                table: "InvoiceTerms");

            migrationBuilder.AlterColumn<Guid>(
                name: "TenantId",
                table: "InvoiceTerms",
                type: "uuid",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "UUID",
                oldNullable: true);
        }
    }
}
