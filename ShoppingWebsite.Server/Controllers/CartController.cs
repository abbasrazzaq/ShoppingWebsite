using Microsoft.AspNetCore.Mvc;

namespace ShoppingWebsite.Server.Controllers
{
    [ApiController]
    [Route("api/cart")]
    public class CartController : Controller
    {
        private readonly CartService _cartService;
        public CartController(CartService cartService) => _cartService = cartService;

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
