using System.Data;
using Dapper;

namespace ShoppingWebsite.Server
{
    public class ShopService
    {
        private readonly IDbConnection _db;
        public ShopService(IDbConnection db) => _db = db;

        public async Task<IEnumerable<ShopItem>> GetShopItems(
            string? name,
            string? category,
            float? maxPrice,
            int? minStock)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@Name", name);
            parameters.Add("@Category", category);
            parameters.Add("@MaxPrice", maxPrice);
            parameters.Add("@MinStock", minStock);

            return await _db.QueryAsync<ShopItem>("GetShopItems_sp",
                parameters,
                commandType: CommandType.StoredProcedure);
        }
    }
}
