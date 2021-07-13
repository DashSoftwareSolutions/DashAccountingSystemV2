using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace DashAccountingSystemV2.Data.Migrations
{
    public partial class TimeActivities : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "TimeActivity",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "UUID", nullable: false, defaultValueSql: "uuid_in(overlay(overlay(md5(random()::text || ':' || clock_timestamp()::text) placing '4' from 13) placing to_hex(floor(random()*(11-8+1) + 8)::int)::text from 17)::cstring)"),
                    TenantId = table.Column<Guid>(type: "UUID", nullable: false),
                    Date = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    EmployeeId = table.Column<Guid>(type: "UUID", nullable: false),
                    CustomerId = table.Column<Guid>(type: "UUID", nullable: false),
                    ProductId = table.Column<Guid>(type: "UUID", nullable: false),
                    IsBillable = table.Column<bool>(type: "boolean", nullable: false),
                    HourlyBillingRate = table.Column<decimal>(type: "numeric", nullable: true),
                    StartTime = table.Column<TimeSpan>(type: "interval", nullable: false),
                    EndTime = table.Column<TimeSpan>(type: "interval", nullable: false),
                    Break = table.Column<TimeSpan>(type: "interval", nullable: true),
                    TimeZone = table.Column<string>(type: "text", nullable: true),
                    Description = table.Column<string>(type: "character varying(2048)", maxLength: 2048, nullable: false),
                    Created = table.Column<DateTime>(type: "TIMESTAMP", nullable: false, defaultValueSql: "now() AT TIME ZONE 'UTC'"),
                    CreatedById = table.Column<Guid>(type: "uuid", nullable: false),
                    Updated = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    UpdatedById = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TimeActivity", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TimeActivity_AspNetUsers_CreatedById",
                        column: x => x.CreatedById,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TimeActivity_AspNetUsers_UpdatedById",
                        column: x => x.UpdatedById,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_TimeActivity_Customer_CustomerId",
                        column: x => x.CustomerId,
                        principalTable: "Customer",
                        principalColumn: "EntityId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TimeActivity_Employee_EmployeeId",
                        column: x => x.EmployeeId,
                        principalTable: "Employee",
                        principalColumn: "EntityId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TimeActivity_Product_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Product",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TimeActivity_Tenant_TenantId",
                        column: x => x.TenantId,
                        principalTable: "Tenant",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_TimeActivity_CreatedById",
                table: "TimeActivity",
                column: "CreatedById");

            migrationBuilder.CreateIndex(
                name: "IX_TimeActivity_CustomerId",
                table: "TimeActivity",
                column: "CustomerId");

            migrationBuilder.CreateIndex(
                name: "IX_TimeActivity_EmployeeId",
                table: "TimeActivity",
                column: "EmployeeId");

            migrationBuilder.CreateIndex(
                name: "IX_TimeActivity_ProductId",
                table: "TimeActivity",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_TimeActivity_TenantId_CustomerId",
                table: "TimeActivity",
                columns: new[] { "TenantId", "CustomerId" });

            migrationBuilder.CreateIndex(
                name: "IX_TimeActivity_TenantId_CustomerId_Date",
                table: "TimeActivity",
                columns: new[] { "TenantId", "CustomerId", "Date" });

            migrationBuilder.CreateIndex(
                name: "IX_TimeActivity_TenantId_EmployeeId",
                table: "TimeActivity",
                columns: new[] { "TenantId", "EmployeeId" });

            migrationBuilder.CreateIndex(
                name: "IX_TimeActivity_TenantId_EmployeeId_CustomerId_Date",
                table: "TimeActivity",
                columns: new[] { "TenantId", "EmployeeId", "CustomerId", "Date" });

            migrationBuilder.CreateIndex(
                name: "IX_TimeActivity_TenantId_EmployeeId_Date",
                table: "TimeActivity",
                columns: new[] { "TenantId", "EmployeeId", "Date" });

            migrationBuilder.CreateIndex(
                name: "IX_TimeActivity_UpdatedById",
                table: "TimeActivity",
                column: "UpdatedById");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TimeActivity");
        }
    }
}
