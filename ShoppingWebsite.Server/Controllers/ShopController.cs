using Microsoft.AspNetCore.Mvc;

namespace ShoppingWebsite.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ShopController : Controller
    {
        private readonly ShopService _shopService;
        public ShopController(ShopService shopService) => _shopService = shopService;

        [HttpGet(Name = "GetShopItems")]
        public async Task<IEnumerable<ShopItem>> Get()
        {
            return await _shopService.GetShopItems();
        }
    }
}
