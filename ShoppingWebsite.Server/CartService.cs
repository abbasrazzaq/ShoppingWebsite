using System.Data;
using Dapper;

namespace ShoppingWebsite.Server
{
    public class CartService
    {
        private readonly IDbConnection _db;
        public CartService(IDbConnection db) => _db = db;

        public async Task<IEnumerable<ShopItem>> GetCartItems(List<int> ids)
        {
            var idsTable = new DataTable();
            idsTable.Columns.Add("Id", typeof(int));
            ids.ForEach(id => idsTable.Rows.Add(id));

            var parameters = new
            {
                Ids = idsTable.AsTableValuedParameter("dbo.IdList")
            };

            var items = await _db.QueryAsync<ShopItem>(
                "GetCartItems_sp",
                parameters,
                commandType: CommandType.StoredProcedure
            );

            return items;
        }
    }
}
