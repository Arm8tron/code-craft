using api.Data;
using api.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Net.Http.Headers;
using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace api.Controller
{
    [ApiController]
    [Route("/auth")]
    public class AuthController : ControllerBase
    {
        public static User user = new User();
        private readonly IConfiguration _configuration;
        private readonly UserDbContext _userDb;
        private readonly IHttpContextAccessor _contextAccessor;

        public AuthController(IConfiguration configuration, UserDbContext db, IHttpContextAccessor contextAccessor)
        {
            _configuration = configuration;
            _userDb = db;
            _contextAccessor = contextAccessor;
        }

        [HttpPost("register")]
        public IActionResult Register([FromBody] RegisterRequest body)
        {

            var username = body.username;
            var isExistsUsername = _userDb.users.FirstOrDefault(item => item.username == username);
            if(isExistsUsername != null)
            {
                return BadRequest(new { error = "User with same username already exists" });
            }

            var email = body.email;
            var isExistsEmail = _userDb.users.FirstOrDefault(item => item.email == email);
            if (isExistsEmail != null)
            {
                return BadRequest(new { error = "User with same email already exists" });
            }



            if (body.password != body.confirm_password)
            {
                return BadRequest(new { error = "Passwords don't match" });
            }

            var passwordhash = BCrypt.Net.BCrypt.HashPassword(body.password);


            User newUser = new User();
            newUser.email = body.email;
            newUser.username = body.username;
            newUser.name = body.name;
            newUser.passwordhash = passwordhash;
            _userDb.users.Add(newUser);
            _userDb.SaveChanges();  


            return Ok(new { success = $"User : {username} created successfully" });
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest body)
        {
            var username = body.username;
            var requiredUser = _userDb.users.FirstOrDefault(item => item.username == username);
            if (requiredUser == null)
            {
                return BadRequest(new { error = "User not found" });
            }

            if(!BCrypt.Net.BCrypt.Verify(body.password, requiredUser.passwordhash))
            {
                return BadRequest(new { error = "Password not valid" });
            }


            string token = createToken(requiredUser);
            var cookieOptions = new CookieOptions();
            cookieOptions.Expires = DateTime.Now.AddDays(60);
            cookieOptions.Secure = false;
            Response.Cookies.Append("session", token, cookieOptions );
            return Ok( new { success = "Fetched user data successfully", token });
        }

        [HttpGet("fetch")]
        [Authorize]
        public IActionResult Fetch()
        {
            var username = User.FindFirst(ClaimTypes.Name)?.Value;
            var userData = _userDb.users.FirstOrDefault(item => item.username == username);
            UserResponse response = new UserResponse();
            response.username = userData.username;
            response.email = userData.email;
            response.name = userData.name != "" ? userData.name : userData.username;
            return Ok(new { response });
        }

        [HttpGet("user")]
        public IActionResult UserData(string username)
        {
            var userData = _userDb.users.FirstOrDefault(item => item.username.Equals(username));

            if(userData == null) { return BadRequest(new { error = "User not found" }); }

            UserResponse response = new UserResponse();
            response.username = userData.username;
            response.email = userData.email;
            response.name = userData.name != "" ? userData.name : userData.username;
            return Ok(new { response });
        }

        private string createToken(User user)
        {
            List<Claim> claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.username),
                new Claim(ClaimTypes.Role, "Admin")
            };

            var key = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(_configuration.GetSection("AppSettings:Token").Value!));

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.Now.AddDays(60),
                signingCredentials: creds
                );

            var jwt = new JwtSecurityTokenHandler().WriteToken(token);

            return jwt;
        }
    }
}
