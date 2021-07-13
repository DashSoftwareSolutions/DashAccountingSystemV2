using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace DashAccountingSystemV2.Data.Migrations
{
    public partial class Customers : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Employee_TenantId",
                table: "Employee");

            migrationBuilder.AddColumn<DateTime>(
                name: "Inactivated",
                table: "Entity",
                type: "timestamp without time zone",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "InactivatedById",
                table: "Entity",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Notes",
                table: "Employee",
                type: "text",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Customer",
                columns: table => new
                {
                    EntityId = table.Column<Guid>(type: "UUID", nullable: false),
                    TenantId = table.Column<Guid>(type: "UUID", nullable: false),
                    CustomerNumber = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: false),
                    NormalizedCustomerNumber = table.Column<string>(type: "text", nullable: true),
                    CompanyName = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false),
                    NormalizedCompanyName = table.Column<string>(type: "text", nullable: true),
                    DisplayName = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false),
                    ContactPersonTitle = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: true),
                    ContactPersonFirstName = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    ContactPersonMiddleName = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    ContactPersonLastName = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    ContactPersonNickName = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    ContactPersonSuffix = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: true),
                    BillingAddressId = table.Column<Guid>(type: "UUID", nullable: false),
                    ShippingAddressId = table.Column<Guid>(type: "UUID", nullable: true),
                    IsShippingAddressSameAsBillingAddress = table.Column<bool>(type: "boolean", nullable: false),
                    Email = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    WorkPhoneNumber = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: true),
                    MobilePhoneNumber = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: true),
                    FaxNumber = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: true),
                    OtherPhoneNumber = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: true),
                    Website = table.Column<string>(type: "character varying(2048)", maxLength: 2048, nullable: true),
                    Notes = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Customer", x => x.EntityId);
                    table.ForeignKey(
                        name: "FK_Customer_Address_BillingAddressId",
                        column: x => x.BillingAddressId,
                        principalTable: "Address",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Customer_Address_ShippingAddressId",
                        column: x => x.ShippingAddressId,
                        principalTable: "Address",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Customer_Entity_EntityId",
                        column: x => x.EntityId,
                        principalTable: "Entity",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Customer_Tenant_TenantId",
                        column: x => x.TenantId,
                        principalTable: "Tenant",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Entity_InactivatedById",
                table: "Entity",
                column: "InactivatedById");

            migrationBuilder.CreateIndex(
                name: "IX_Employee_TenantId_EmployeeNumber",
                table: "Employee",
                columns: new[] { "TenantId", "EmployeeNumber" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Customer_BillingAddressId",
                table: "Customer",
                column: "BillingAddressId");

            migrationBuilder.CreateIndex(
                name: "IX_Customer_EntityId",
                table: "Customer",
                column: "EntityId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Customer_ShippingAddressId",
                table: "Customer",
                column: "ShippingAddressId");

            migrationBuilder.CreateIndex(
                name: "IX_Customer_TenantId_NormalizedCompanyName",
                table: "Customer",
                columns: new[] { "TenantId", "NormalizedCompanyName" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Customer_TenantId_NormalizedCustomerNumber",
                table: "Customer",
                columns: new[] { "TenantId", "NormalizedCustomerNumber" },
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Entity_AspNetUsers_InactivatedById",
                table: "Entity",
                column: "InactivatedById",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Entity_AspNetUsers_InactivatedById",
                table: "Entity");

            migrationBuilder.DropTable(
                name: "Customer");

            migrationBuilder.DropIndex(
                name: "IX_Entity_InactivatedById",
                table: "Entity");

            migrationBuilder.DropIndex(
                name: "IX_Employee_TenantId_EmployeeNumber",
                table: "Employee");

            migrationBuilder.DropColumn(
                name: "Inactivated",
                table: "Entity");

            migrationBuilder.DropColumn(
                name: "InactivatedById",
                table: "Entity");

            migrationBuilder.DropColumn(
                name: "Notes",
                table: "Employee");

            migrationBuilder.CreateIndex(
                name: "IX_Employee_TenantId",
                table: "Employee",
                column: "TenantId");
        }
    }
}
