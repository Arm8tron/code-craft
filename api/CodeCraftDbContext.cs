using api.Model;
using Microsoft.EntityFrameworkCore;

namespace api
{
    public class CodeCraftDbContext : DbContext
    {
        public CodeCraftDbContext(DbContextOptions<CodeCraftDbContext>  options) : base(options) { }

        
        public DbSet<CodeCraft> codeCrafts {  get; set; }
 
    }
}
