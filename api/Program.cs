using api;
using api.Model;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);
var allowedOrigins = builder.Configuration.GetSection("AllowedOrigins").Get<string[]>();
builder.Services.AddCors(options =>
{
    options.AddPolicy("myCors", policy =>
    {
        try
        {
            policy.WithOrigins(allowedOrigins).AllowAnyHeader().AllowAnyMethod();
        } catch (Exception ex)
        {
            Console.WriteLine(ex);
        }
    });
});
builder.Services.AddDbContext<CodeCraftDbContext>(opt => opt.UseSqlServer(
    builder.Configuration.GetConnectionString("CodeCraft")
));

builder.Services.AddControllers();

var app = builder.Build();
app.UseCors("myCors");

app.MapGet("/", () => "Home1");
app.MapGet("/all", (CodeCraftDbContext db) => {
    IEnumerable<CodeCraft> codeCrafts = db.codeCrafts;
    return codeCrafts;
});


app.MapControllers();
app.Run();
