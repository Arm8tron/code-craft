using api.Data;
using api.Model;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

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
builder.Services.AddDbContext<UserDbContext>(opt => opt.UseSqlServer(
    builder.Configuration.GetConnectionString("Users")
));

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options =>
{
    options.SaveToken = true;
    options.RequireHttpsMetadata = false;
    options.TokenValidationParameters = new TokenValidationParameters()
    {
        ValidateIssuer = false,
        ValidateAudience = false,
        ClockSkew = TimeSpan.Zero,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["AppSettings:Token"]!))
    };
});

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
