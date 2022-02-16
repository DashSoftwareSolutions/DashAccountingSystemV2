using Microsoft.EntityFrameworkCore.Migrations;

namespace DashAccountingSystemV2.Data.Migrations
{
    public partial class InvoiceNumberUniqueIndex : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_Invoice_TenantId_InvoiceNumber",
                table: "Invoice",
                columns: new[] { "TenantId", "InvoiceNumber" },
                unique: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Invoice_TenantId_InvoiceNumber",
                table: "Invoice");
        }
    }
}
