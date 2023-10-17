using api.Model;
using Microsoft.EntityFrameworkCore;

namespace api.Data
{
    public class UserDbContext : DbContext
    {
        public UserDbContext(DbContextOptions<UserDbContext> options) : base(options) { }

        public DbSet<User> users { get; set; }

    }
}
