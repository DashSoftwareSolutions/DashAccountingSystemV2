using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace DashAccountingSystemV2.Data.Migrations
{
    public partial class AddressAuditInfo : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "Created",
                table: "Address",
                type: "TIMESTAMP",
                nullable: false,
                defaultValueSql: "now() AT TIME ZONE 'UTC'");

            migrationBuilder.AddColumn<Guid>(
                name: "CreatedById",
                table: "Address",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "Updated",
                table: "Address",
                type: "timestamp without time zone",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "UpdatedById",
                table: "Address",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Address_CreatedById",
                table: "Address",
                column: "CreatedById");

            migrationBuilder.CreateIndex(
                name: "IX_Address_UpdatedById",
                table: "Address",
                column: "UpdatedById");

            migrationBuilder.AddForeignKey(
                name: "FK_Address_AspNetUsers_CreatedById",
                table: "Address",
                column: "CreatedById",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Address_AspNetUsers_UpdatedById",
                table: "Address",
                column: "UpdatedById",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Address_AspNetUsers_CreatedById",
                table: "Address");

            migrationBuilder.DropForeignKey(
                name: "FK_Address_AspNetUsers_UpdatedById",
                table: "Address");

            migrationBuilder.DropIndex(
                name: "IX_Address_CreatedById",
                table: "Address");

            migrationBuilder.DropIndex(
                name: "IX_Address_UpdatedById",
                table: "Address");

            migrationBuilder.DropColumn(
                name: "Created",
                table: "Address");

            migrationBuilder.DropColumn(
                name: "CreatedById",
                table: "Address");

            migrationBuilder.DropColumn(
                name: "Updated",
                table: "Address");

            migrationBuilder.DropColumn(
                name: "UpdatedById",
                table: "Address");
        }
    }
}
