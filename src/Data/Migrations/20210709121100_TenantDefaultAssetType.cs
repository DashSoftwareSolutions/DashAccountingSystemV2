using Microsoft.EntityFrameworkCore.Migrations;

namespace DashAccountingSystemV2.Data.Migrations
{
    public partial class TenantDefaultAssetType : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "DefaultAssetTypeId",
                table: "Tenant",
                type: "integer",
                nullable: false,
                defaultValue: 1); // Asset Type ID 1 = USD

            migrationBuilder.CreateIndex(
                name: "IX_Tenant_DefaultAssetTypeId",
                table: "Tenant",
                column: "DefaultAssetTypeId");

            migrationBuilder.AddForeignKey(
                name: "FK_Tenant_AssetType_DefaultAssetTypeId",
                table: "Tenant",
                column: "DefaultAssetTypeId",
                principalTable: "AssetType",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Tenant_AssetType_DefaultAssetTypeId",
                table: "Tenant");

            migrationBuilder.DropIndex(
                name: "IX_Tenant_DefaultAssetTypeId",
                table: "Tenant");

            migrationBuilder.DropColumn(
                name: "DefaultAssetTypeId",
                table: "Tenant");
        }
    }
}
