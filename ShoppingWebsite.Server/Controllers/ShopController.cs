using Microsoft.AspNetCore.Mvc;

namespace ShoppingWebsite.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ShopController : Controller
    {
        public ShopItem[] StubShopItems = new ShopItem[]
        {
            new ShopItem { Id = 1, Name = "Harry Potter", Price = 3.5f, Stock = 3, Category = ShopItemCategory.Books },
            new ShopItem { Id = 2, Name = "Hammer", Price = 34, Stock = 23, Category = ShopItemCategory.DIY },
            new ShopItem { Id = 3, Name = "Mayonnaise", Price = 4.25f, Stock = 124, Category = ShopItemCategory.Groceries }
        };

        private readonly ShopService _shopService;
        public ShopController(ShopService shopService) => _shopService = shopService;

        // TODO: Paging
        [HttpGet(Name = "GetShopItems")]
        public async Task<IEnumerable<ShopItem>>/* ActionResult<ShopItem[]>*/ Get()
        {
            return await _shopService.GetShopItems();
            //return Ok(StubShopItems);
        }
    }
}
