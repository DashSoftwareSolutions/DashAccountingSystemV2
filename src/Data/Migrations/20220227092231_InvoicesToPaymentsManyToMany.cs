using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace DashAccountingSystemV2.Data.Migrations
{
    public partial class InvoicesToPaymentsManyToMany : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "RevenueAccountId",
                table: "Payment",
                type: "UUID",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateTable(
                name: "InvoicePayment",
                columns: table => new
                {
                    InvoiceId = table.Column<Guid>(type: "UUID", nullable: false),
                    PaymentId = table.Column<Guid>(type: "UUID", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_InvoicePayment", x => new { x.InvoiceId, x.PaymentId });
                    table.ForeignKey(
                        name: "FK_InvoicePayment_Invoice_InvoiceId",
                        column: x => x.InvoiceId,
                        principalTable: "Invoice",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_InvoicePayment_Payment_PaymentId",
                        column: x => x.PaymentId,
                        principalTable: "Payment",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Payment_RevenueAccountId",
                table: "Payment",
                column: "RevenueAccountId");

            migrationBuilder.CreateIndex(
                name: "IX_InvoicePayment_InvoiceId",
                table: "InvoicePayment",
                column: "InvoiceId");

            migrationBuilder.CreateIndex(
                name: "IX_InvoicePayment_PaymentId",
                table: "InvoicePayment",
                column: "PaymentId");

            migrationBuilder.AddForeignKey(
                name: "FK_Payment_Account_RevenueAccountId",
                table: "Payment",
                column: "RevenueAccountId",
                principalTable: "Account",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Payment_Account_RevenueAccountId",
                table: "Payment");

            migrationBuilder.DropTable(
                name: "InvoicePayment");

            migrationBuilder.DropIndex(
                name: "IX_Payment_RevenueAccountId",
                table: "Payment");

            migrationBuilder.DropColumn(
                name: "RevenueAccountId",
                table: "Payment");
        }
    }
}
