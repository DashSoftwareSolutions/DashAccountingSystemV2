using Microsoft.EntityFrameworkCore.Migrations;

namespace DashAccountingSystemV2.Data.Migrations
{
    public partial class MakeAccountSubTypeMandatory : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Account_AccountSubType_AccountSubTypeId",
                table: "Account");

            migrationBuilder.AlterColumn<int>(
                name: "AccountSubTypeId",
                table: "Account",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Account_AccountSubType_AccountSubTypeId",
                table: "Account",
                column: "AccountSubTypeId",
                principalTable: "AccountSubType",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Account_AccountSubType_AccountSubTypeId",
                table: "Account");

            migrationBuilder.AlterColumn<int>(
                name: "AccountSubTypeId",
                table: "Account",
                type: "integer",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AddForeignKey(
                name: "FK_Account_AccountSubType_AccountSubTypeId",
                table: "Account",
                column: "AccountSubTypeId",
                principalTable: "AccountSubType",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
