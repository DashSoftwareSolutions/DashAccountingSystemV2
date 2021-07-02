using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

namespace DashAccountingSystemV2.Data.Migrations
{
    public partial class AddAccountSubType : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "AccountSubTypeId",
                table: "Account",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "AccountSubType",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    Name = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    AccountTypeId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AccountSubType", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AccountSubType_AccountType_AccountTypeId",
                        column: x => x.AccountTypeId,
                        principalTable: "AccountType",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Account_AccountSubTypeId",
                table: "Account",
                column: "AccountSubTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_AccountSubType_AccountTypeId",
                table: "AccountSubType",
                column: "AccountTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_AccountSubType_Name",
                table: "AccountSubType",
                column: "Name",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Account_AccountSubType_AccountSubTypeId",
                table: "Account",
                column: "AccountSubTypeId",
                principalTable: "AccountSubType",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Account_AccountSubType_AccountSubTypeId",
                table: "Account");

            migrationBuilder.DropTable(
                name: "AccountSubType");

            migrationBuilder.DropIndex(
                name: "IX_Account_AccountSubTypeId",
                table: "Account");

            migrationBuilder.DropColumn(
                name: "AccountSubTypeId",
                table: "Account");
        }
    }
}
