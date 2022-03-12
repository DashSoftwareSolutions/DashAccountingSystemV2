using Microsoft.EntityFrameworkCore.Migrations;

namespace DashAccountingSystemV2.Data.Migrations
{
    public partial class FixAddressType : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            /*migrationBuilder.AlterColumn<int>(
                name: "AddressType",
                table: "Address",
                type: "INT4",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(32)",
                oldMaxLength: 32);*/

            // Have to specify the explicit cast.
            // Otherwise it fails with:
            //     Exception data:
            //       Severity: ERROR
            //       SqlState: 42804
            //       MessageText: column "AddressType" cannot be cast automatically to type integer
            //       Hint: You might need to specify "USING "AddressType"::integer".
            //       File: d:\pginstaller.auto\postgres.windows - x64\src\backend\commands\tablecmds.c
            //       Line: 9809
            //       Routine: ATPrepAlterColumnType
            migrationBuilder.Sql(@"ALTER TABLE ""Address"" ALTER COLUMN ""AddressType"" TYPE INT4 USING ""AddressType""::INT4;");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "AddressType",
                table: "Address",
                type: "character varying(32)",
                maxLength: 32,
                nullable: false,
                oldClrType: typeof(int),
                oldType: "INT4");
        }
    }
}
