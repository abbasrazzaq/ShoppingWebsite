using Microsoft.AspNetCore.Mvc;

namespace ShoppingWebsite.Server.Controllers
{
    public class CartItem
    {
        public required int ItemId { get; set; }
        public required int ItemCount { get; set; }
    }

    [ApiController]
    [Route("api/cart")]
    public class CartController : Controller
    {
        private readonly CartService _cartService;
        public CartController(CartService cartService) => _cartService = cartService;

        [HttpPost("buyitems")]
        public async Task<IActionResult> BuyItems([FromBody] List<CartItem> cartItems)
        {
            try
            {
                await _cartService.BuyCartItems(cartItems);
            }
            catch
            {
                return StatusCode(500);
            }

            return Ok();

        }

        [HttpPost("getcartitems")]
        public async Task<IActionResult> Get([FromBody] List<int> itemIds)
        {
            if (itemIds == null || !itemIds.Any())
                return BadRequest("Please provide at least one ID.");

            IEnumerable<ShopItem> items;

            try
            {
                items = await _cartService.GetCartItems(itemIds);
            }
            catch(Exception ex)
            {
                // TODO: Logging
                return StatusCode(500);
            }

            return Ok(items);
        }
    }
}
