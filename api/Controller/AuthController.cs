using api.Data;
using api.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text.Json.Serialization;

namespace api.Controller
{
    [ApiController]
    [Route("/auth")]
    public class AuthController : ControllerBase
    {
        public static User user = new User();
        private readonly IConfiguration _configuration;
        private readonly UserDbContext _userDb;

        public AuthController(IConfiguration configuration, UserDbContext db)
        {
            _configuration = configuration;
            _userDb = db;
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
            UserResponse userResponse = new UserResponse();
            userResponse.token = token;
            userResponse.username = requiredUser.username;
            userResponse.email = requiredUser.email;
            return Ok( new { success = "Fetched user data successfully", userResponse });
        }

        private void createPasswordHash(string password, out byte[] passwordhash, out byte[] passwordsalt) 
        { 
            using (var hmac = new HMACSHA512())
            {
                passwordsalt = hmac.Key;
                passwordhash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));

            }
        }

        private bool verifyPasswordHash(string password, byte[] passwordhash, byte[] passwordsalt)
        {
            using(var hmac = new HMACSHA512(passwordsalt))
            {
                var computedHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));

                return computedHash.SequenceEqual(passwordhash);
            }
        }

        private string createToken(User user)
        {
            List<Claim> claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.username)
            };

            var key = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(_configuration.GetSection("AppSettings:Token").Value));

            var cred = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.Now.AddDays(30),
                signingCredentials: cred
                );

            var jwt = new JwtSecurityTokenHandler().WriteToken(token);

            return jwt;
        }
    }
}
