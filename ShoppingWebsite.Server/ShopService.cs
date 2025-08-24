using System.Data;
using Dapper;

namespace ShoppingWebsite.Server
{
    public class ShopService
    {
        private readonly IDbConnection _db;
        private readonly int _pageSize;
        public ShopService(IDbConnection db, IConfiguration configuration)
        {
            _db = db;
            _pageSize = configuration.GetValue<int>("ShopSettings:PageSize");
        }

        public class ShopItemsPage
        {
            public int PageCount { get; set; }
            public IEnumerable<ShopItem> Items { get; set; } = Enumerable.Empty<ShopItem>();
        }

        public async Task<ShopItemsPage> GetShopItems(
            int pageIndex,
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
            parameters.Add("@PageIndex", pageIndex);
            parameters.Add("@PageSize", _pageSize);

            using var multi = await _db.QueryMultipleAsync("GetShopItems_sp", parameters, commandType: CommandType.StoredProcedure);
            var totalCount = await multi.ReadFirstAsync<int>();
            var items = await multi.ReadAsync<ShopItem>();

            return new ShopItemsPage
            {
                PageCount = (int)Math.Ceiling((double)totalCount / _pageSize),
                Items = items
            };

            //return await _db.QueryAsync<ShopItem>("GetShopItems_sp",
            //    parameters,
            //    commandType: CommandType.StoredProcedure);
        }
    }
}
