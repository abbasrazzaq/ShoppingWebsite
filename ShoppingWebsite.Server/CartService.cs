using System.Data;
using System.Security.Claims;
using Dapper;
using Microsoft.Data.SqlClient;

namespace ShoppingWebsite.Server
{
    public class CartService
    {
        private readonly IDbConnection _db;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public CartService(IDbConnection db, IHttpContextAccessor httpContextAccessor)
        {
            _db = db;
            _httpContextAccessor = httpContextAccessor;
        }

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
                CartItemList = cartItemsTable.AsTableValuedParameter("dbo.CartItemList"),
                BankBalance = await GetUserBankBalance()
            };

            try 
            {
                await _db.ExecuteAsync(
                    "BuyItems_sp",
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
                else if(ex.Number == 50001)
                {
                    throw new InvalidOperationException("One or more items could not be processed due to insufficient balance.", ex);
                }
                else
                {
                    throw;
                }
            }
        }

        public async Task<int> GetUserBankBalance()
        {
            var user = _httpContextAccessor.HttpContext?.User;
            int userId = int.Parse(user?.FindFirst(ClaimTypes.NameIdentifier)?.Value);

            var parameters = new
            {
                UserId = userId
            };

            return await _db.QueryFirstOrDefaultAsync<int>(
                "GetUserBankBalance_sp",
                parameters,
                commandType: CommandType.StoredProcedure
                );
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
