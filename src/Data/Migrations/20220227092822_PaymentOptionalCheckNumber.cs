using Microsoft.EntityFrameworkCore.Migrations;

namespace DashAccountingSystemV2.Data.Migrations
{
    public partial class PaymentOptionalCheckNumber : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<long>(
                name: "CheckNumber",
                table: "Payment",
                type: "bigint",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CheckNumber",
                table: "Payment");
        }
    }
}
