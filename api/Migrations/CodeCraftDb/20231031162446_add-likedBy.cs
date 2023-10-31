using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace api.Migrations.CodeCraftDb
{
    /// <inheritdoc />
    public partial class addlikedBy : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "LikedBy",
                table: "codeCrafts",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LikedBy",
                table: "codeCrafts");
        }
    }
}
