using Microsoft.AspNetCore.Mvc;

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
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest req)
        {
            bool loginOk = (req.Username == "abbas" && req.Password == "password");
            return Ok(new LoginResponse
            {
                Success = loginOk,
                Message = loginOk ? "Welcome!" : "Invalid credentials"
            });
        }
    }
}
