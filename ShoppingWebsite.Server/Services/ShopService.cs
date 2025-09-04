using System.Data;
using Dapper;

namespace ShoppingWebsite.Server.Services
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
            public required IEnumerable<ShopItemCategoryFilterDto> CategoriesFilter { get; set; }
        }

        public class ShopItemCategoryFilterDto
        {
            public int Id { get; set; }
            public required string Name { get; set; }
        }

        public async Task<ShopItemsPage> GetShopItems(
            int pageIndex,
            string? name,
            string? categories,
            float? maxPrice,
            int? minStock)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@Name", name);

            bool filterByCategories = false;
            if(!string.IsNullOrWhiteSpace(categories))
            {
                var categoriesTable = new DataTable();
                categoriesTable.Columns.Add("Id", typeof(int));
                categories.Split(',')
                    .Select(c => c.Trim())
                    .Where(c => int.TryParse(c, out var intVal) && Enum.IsDefined(typeof(ShopItemCategory), intVal))
                    .Select(c => (ShopItemCategory)int.Parse(c))
                    .ToList()
                    .ForEach(c => categoriesTable.Rows.Add((int)c));

                filterByCategories = categoriesTable.Rows.Count > 0;

                parameters.Add("@Categories", categoriesTable.AsTableValuedParameter("dbo.IdList"));
            }
            parameters.Add("@FilterByCategories", filterByCategories);
            
            parameters.Add("@MaxPrice", maxPrice);
            parameters.Add("@MinStock", minStock);
            parameters.Add("@PageIndex", pageIndex);
            parameters.Add("@PageSize", _pageSize);

            using var multi = await _db.QueryMultipleAsync("GetShopItems_sp", parameters, commandType: CommandType.StoredProcedure);
            // Total number of items that match the filter
            var totalCount = await multi.ReadFirstAsync<int>();
            // Items for the current page
            var items = await multi.ReadAsync<ShopItem>();
            // Categories list
            var categoriesFilter = Enum.GetValues(typeof(ShopItemCategory))
                                    .Cast<ShopItemCategory>()
                                    .Select(c => new ShopItemCategoryFilterDto
                                    { 
                                        Id = (int)c,
                                        Name = Enum.GetName(typeof(ShopItemCategory), c) ?? c.ToString()
                                    })
                                    .ToList();

            return new ShopItemsPage
            {
                PageCount = (int)Math.Ceiling((double)totalCount / _pageSize),
                Items = items,
                CategoriesFilter = categoriesFilter
            };

            //return await _db.QueryAsync<ShopItem>("GetShopItems_sp",
            //    parameters,
            //    commandType: CommandType.StoredProcedure);
        }
    }
}
