using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace DashAccountingSystemV2.Data.Migrations
{
    public partial class DropTimeActivityInvoiceLineItemId : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TimeActivity_InvoiceLineItem_InvoiceLineItemId",
                table: "TimeActivity");

            migrationBuilder.DropIndex(
                name: "IX_TimeActivity_InvoiceLineItemId",
                table: "TimeActivity");

            migrationBuilder.DropColumn(
                name: "InvoiceLineItemId",
                table: "TimeActivity");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "InvoiceLineItemId",
                table: "TimeActivity",
                type: "UUID",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_TimeActivity_InvoiceLineItemId",
                table: "TimeActivity",
                column: "InvoiceLineItemId");

            migrationBuilder.AddForeignKey(
                name: "FK_TimeActivity_InvoiceLineItem_InvoiceLineItemId",
                table: "TimeActivity",
                column: "InvoiceLineItemId",
                principalTable: "InvoiceLineItem",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
