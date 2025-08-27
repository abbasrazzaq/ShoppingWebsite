using System.Data;
using Dapper;
using Microsoft.Data.SqlClient;

namespace ShoppingWebsite.Server
{
    public class CartService
    {
        private readonly IDbConnection _db;
        public CartService(IDbConnection db) => _db = db;

        public async Task BuyCartItems(List<ShoppingWebsite.Server.Controllers.CartItem> cartItems)
        {
            var cartItemsTable = new DataTable();
            cartItemsTable.Columns.Add("Id", typeof(int));
            cartItemsTable.Columns.Add("Count", typeof(int));

            cartItems.ForEach(item => 
            { 
                cartItemsTable.Rows.Add(item.ItemId, item.ItemCount);
            });

            var parameters = new
            {
                CartItemList = cartItemsTable.AsTableValuedParameter("dbo.CartItemList")
            };

            try 
            {
                await _db.ExecuteAsync("BuyItems_sp",
                parameters,
                commandType: CommandType.StoredProcedure);
            }
            catch (SqlException ex)
            {
                if(ex.Number == 50000)
                {
                    // TODO: Log
                    throw new InvalidOperationException("One or more items could not be processed due to insufficient stock.", ex);
                }
                else
                {
                    throw;
                }
            }

            
        }
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
