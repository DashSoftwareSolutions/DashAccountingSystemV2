using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace DashAccountingSystemV2.Data.Migrations
{
    public partial class TimeActivitiesToInvoiceLineItemsTake2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "InvoiceLineItemTimeActivity",
                columns: table => new
                {
                    InvoiceLineItemId = table.Column<Guid>(type: "UUID", nullable: false),
                    TimeActivityId = table.Column<Guid>(type: "UUID", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_InvoiceLineItemTimeActivity", x => new { x.InvoiceLineItemId, x.TimeActivityId });
                    table.ForeignKey(
                        name: "FK_InvoiceLineItemTimeActivity_InvoiceLineItem_InvoiceLineItem~",
                        column: x => x.InvoiceLineItemId,
                        principalTable: "InvoiceLineItem",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_InvoiceLineItemTimeActivity_TimeActivity_TimeActivityId",
                        column: x => x.TimeActivityId,
                        principalTable: "TimeActivity",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_InvoiceLineItemTimeActivity_InvoiceLineItemId",
                table: "InvoiceLineItemTimeActivity",
                column: "InvoiceLineItemId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_InvoiceLineItemTimeActivity_TimeActivityId",
                table: "InvoiceLineItemTimeActivity",
                column: "TimeActivityId",
                unique: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "InvoiceLineItemTimeActivity");
        }
    }
}
