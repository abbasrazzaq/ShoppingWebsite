using Dapper;
using Microsoft.AspNetCore.Identity;
using System.ComponentModel;
using System.Data;

namespace ShoppingWebsite.Server.Services
{
    public class LoginService
    {
        public class UserLoginInfo
        {
            public required int Id { get; set; }
            public required string Password { get; set; }
        }

        private readonly IDbConnection _db;
        private readonly PasswordHasher<object> _hasher;

        public LoginService(IDbConnection db) 
        {
            _db = db;
            _hasher = new PasswordHasher<object>();
        }

        public async Task<int> ValidateLogin(string username, string password)
        {
            var parmeters = new { username };
            var loginInfo = await _db.QuerySingleOrDefaultAsync<UserLoginInfo>(
                "ValidateLogin_sp",
                parmeters,
                commandType: CommandType.StoredProcedure);

            if(loginInfo is not null
                && _hasher.VerifyHashedPassword(null, loginInfo.Password, password) == PasswordVerificationResult.Success)
            {
                return loginInfo.Id;
            }
            else
            {
                return 0;
            }
            
        }
    }
}
