using System.Data;
using Dapper;

namespace ShoppingWebsite.Server
{
    public class ShopService
    {
        private readonly IDbConnection _db;
        public ShopService(IDbConnection db) => _db = db;

        public async Task<IEnumerable<ShopItem>> GetShopItems()
        {
            return await _db.QueryAsync<ShopItem>("GetShopItems_sp",
                commandType: CommandType.StoredProcedure);
        }
    }
}
