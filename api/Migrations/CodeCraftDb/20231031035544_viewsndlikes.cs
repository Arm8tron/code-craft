using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace api.Migrations.CodeCraftDb
{
    /// <inheritdoc />
    public partial class viewsndlikes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "LikesCount",
                table: "codeCrafts",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "ViewsCount",
                table: "codeCrafts",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LikesCount",
                table: "codeCrafts");

            migrationBuilder.DropColumn(
                name: "ViewsCount",
                table: "codeCrafts");
        }
    }
}
