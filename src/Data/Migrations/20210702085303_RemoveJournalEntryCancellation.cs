using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace DashAccountingSystemV2.Data.Migrations
{
    public partial class RemoveJournalEntryCancellation : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_JournalEntry_AspNetUsers_CanceledById",
                table: "JournalEntry");

            migrationBuilder.DropIndex(
                name: "IX_JournalEntry_CanceledById",
                table: "JournalEntry");

            migrationBuilder.DropColumn(
                name: "CancelDate",
                table: "JournalEntry");

            migrationBuilder.DropColumn(
                name: "CanceledById",
                table: "JournalEntry");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "CancelDate",
                table: "JournalEntry",
                type: "timestamp without time zone",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "CanceledById",
                table: "JournalEntry",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_JournalEntry_CanceledById",
                table: "JournalEntry",
                column: "CanceledById");

            migrationBuilder.AddForeignKey(
                name: "FK_JournalEntry_AspNetUsers_CanceledById",
                table: "JournalEntry",
                column: "CanceledById",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
