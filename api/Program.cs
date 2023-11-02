using api.Data;
using api.Model;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.AspNetCore.Authentication.Cookies;

var builder = WebApplication.CreateBuilder(args);
var allowedOrigins = builder.Configuration.GetSection("AllowedOrigins").Get<string[]>();
builder.Services.AddCors(options =>
{
    options.AddPolicy("myCors", policy =>
    {
        try
        {
            policy.WithOrigins(allowedOrigins).AllowAnyHeader().AllowAnyMethod().AllowCredentials();
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
builder.Services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();

builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        options.Cookie.Name = "session";
        options.Cookie.Path = "/";
        options.ExpireTimeSpan = TimeSpan.FromDays(60);
        options.SlidingExpiration = true;
        options.Cookie.HttpOnly = true;
        options.Cookie.SameSite = SameSiteMode.Lax; // Set SameSite to None
        options.Cookie.SecurePolicy = CookieSecurePolicy.SameAsRequest; // Set Secure to None for development
    });

builder.Services.AddAuthorization();

builder.Services.AddControllers();

var app = builder.Build();
app.UseCors("myCors");
app.UseAuthentication();
app.UseAuthorization();
var cookiePolicyOptions = new CookiePolicyOptions
{
    MinimumSameSitePolicy = SameSiteMode.None,
};
app.UseCookiePolicy(cookiePolicyOptions);

app.MapGet("/", () => "Server Running");
app.MapGet("/all", (CodeCraftDbContext db) => {
    IEnumerable<CodeCraft> codeCrafts = db.codeCrafts.Where(item => item.IsPublic == true);
    return codeCrafts;
});


app.MapControllers();
app.Run();
