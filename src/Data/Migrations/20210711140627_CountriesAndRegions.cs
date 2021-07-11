using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

namespace DashAccountingSystemV2.Data.Migrations
{
    public partial class CountriesAndRegions : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Country",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    Name = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: false),
                    TwoLetterCode = table.Column<string>(type: "character varying(2)", maxLength: 2, nullable: false),
                    ThreeLetterCode = table.Column<string>(type: "character varying(3)", maxLength: 3, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Country", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Region",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    Label = table.Column<string>(type: "text", nullable: true),
                    Name = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: false),
                    Code = table.Column<string>(type: "character varying(3)", maxLength: 3, nullable: false),
                    CountryId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Region", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Region_Country_CountryId",
                        column: x => x.CountryId,
                        principalTable: "Country",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Country_ThreeLetterCode",
                table: "Country",
                column: "ThreeLetterCode",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Country_TwoLetterCode",
                table: "Country",
                column: "TwoLetterCode",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Region_CountryId",
                table: "Region",
                column: "CountryId");

            migrationBuilder.CreateIndex(
                name: "IX_Region_CountryId_Code",
                table: "Region",
                columns: new[] { "CountryId", "Code" },
                unique: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Region");

            migrationBuilder.DropTable(
                name: "Country");
        }
    }
}
