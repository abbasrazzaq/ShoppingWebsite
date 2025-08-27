namespace ShoppingWebsite.Server
{
    public enum ShopItemCategory
    {
        Misc =      0,
        Books =     1,
        Groceries = 2,
        DIY =       3,
        Clothing =  4
    };

    public class ShopItem
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public float Price { get; set; }
        public int Stock { get; set; }
        public ShopItemCategory Category { get; set; }

    }
}
