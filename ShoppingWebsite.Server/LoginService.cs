using Dapper;
using System.ComponentModel;
using System.Data;

namespace ShoppingWebsite.Server
{
    public class LoginService
    {
        private readonly IDbConnection _db;
        public LoginService(IDbConnection db) => _db = db;

        // TODO: Will need to return a token (permissions etc)
        public async Task<bool> ValidateLogin(string username, string password)
        {
            // TODO: hash password
            var parmeters = new { username, password };
            return await _db.QueryFirstOrDefaultAsync<bool>("ValidateLogin_sp",
                parmeters,
                commandType: CommandType.StoredProcedure);
        }
    }
}
