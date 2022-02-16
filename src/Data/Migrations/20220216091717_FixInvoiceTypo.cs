using Microsoft.EntityFrameworkCore.Migrations;

namespace DashAccountingSystemV2.Data.Migrations
{
    public partial class FixInvoiceTypo : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "CustomrEmail",
                table: "Invoice",
                newName: "CustomerEmail");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "CustomerEmail",
                table: "Invoice",
                newName: "CustomrEmail");
        }
    }
}
