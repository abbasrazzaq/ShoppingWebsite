using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using ShoppingWebsite.Server.Services;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace ShoppingWebsite.Server.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        public class LoginRequest
        {
            public required string Username { get; set; }
            public required string Password { get; set; }
        };

        public class LoginResponse
        {
            public bool Success { get; set; }
            public required string Message { get; set; }
            public string AccessToken { get; set; }
            public int ExpiresIn { get; set; } // in seconds
        }

        public LoginService _service;
        private readonly JwtSettings _jwt;

        public AuthController(LoginService service, IOptions<JwtSettings> jwtOptions)
        {
            _service = service;
            _jwt = jwtOptions.Value;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest req)
        {
            int userId = await _service.ValidateLogin(req.Username, req.Password);
            if (userId == 0)
            {
                return Unauthorized(new LoginResponse
                {
                    Success = false,
                    Message = "Invalid credentials"
                });
            } 

            var token = GenerateJwtToken(req.Username, userId);
            return Ok(new LoginResponse 
            { 
                Success = true,
                Message = "Welcome!",
                AccessToken = token,
                ExpiresIn = _jwt.TokenLifetimeInMinutes * 60
            });
        }

        private string GenerateJwtToken(string username, int userId)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwt.Secret));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.Name, username),
                new Claim(ClaimTypes.NameIdentifier, userId.ToString()),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())

            };

            var token = new JwtSecurityToken(
                issuer: _jwt.Issuer,
                audience: _jwt.Audience,
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(_jwt.TokenLifetimeInMinutes),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
