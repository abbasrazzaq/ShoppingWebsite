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
        public async Task<IActionResult> Get(
            [FromQuery] int? pageIndex,
            [FromQuery] string? name,
            [FromQuery] string? categories,
            [FromQuery] float? maxPrice,
            [FromQuery] int? minStock
            )
        {
            var result = await _shopService.GetShopItems(pageIndex ?? 0, name, categories, maxPrice, minStock);

            return Ok(new {
                items = result.Items,
                pageCount = result.PageCount,
                categoriesFilter = result.CategoriesFilter
            });
        }
    }
}
