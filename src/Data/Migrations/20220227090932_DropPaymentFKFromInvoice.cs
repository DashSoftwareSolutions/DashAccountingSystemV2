using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace DashAccountingSystemV2.Data.Migrations
{
    public partial class DropPaymentFKFromInvoice : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Invoice_Payment_PaymentId",
                table: "Invoice");

            migrationBuilder.DropIndex(
                name: "IX_Invoice_PaymentId",
                table: "Invoice");

            migrationBuilder.DropColumn(
                name: "PaymentId",
                table: "Invoice");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "PaymentId",
                table: "Invoice",
                type: "UUID",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Invoice_PaymentId",
                table: "Invoice",
                column: "PaymentId");

            migrationBuilder.AddForeignKey(
                name: "FK_Invoice_Payment_PaymentId",
                table: "Invoice",
                column: "PaymentId",
                principalTable: "Payment",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
