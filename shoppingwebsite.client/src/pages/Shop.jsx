import { useState, useEffect } from 'react';

function Shop( { cartItems, setCartItems } ) {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [nameFilter, setNameFilter] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [priceFilter, setPriceFilter] = useState('');
    const [stockFilter, setStockFilter] = useState('');

    useEffect(() => {
        async function populateShopItems() {
            try {
                const params = new URLSearchParams();
                if (nameFilter) params.append('name', nameFilter);
                if (categoryFilter) params.append('category', categoryFilter);
                if (priceFilter) params.append('maxPrice', priceFilter);
                if (stockFilter) params.append('minStock', stockFilter);

                const response = await fetch(`api/shop?${params.toString()}`);
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                const data = await response.json();
                setItems(data);
            }
            catch (err) {
                console.error('Failed to fetch shop items: ' + err);
            }
            finally {
                setLoading(false);
            }
            
        }

        populateShopItems();

    }, [nameFilter, categoryFilter, priceFilter, stockFilter]);


    if (loading) return <div>Loading items...</div>;

    function addItemToCart(id, setCartItems) {
        setCartItems((prev) => ({
            ...prev,
            [id]: (prev[id] || 0) + 1,
        }));
    };

    return (
        <div>
            <h2>Shop Items</h2>
            <div style={{ marginBotton: '1em' }}>
                <input
                    type="text"
                    placeholder="Filter by name"
                    value={nameFilter}
                    onChange={(e) => setNameFilter(e.target.value)}
                    style={{ marginRight: '0.5em' }}
                />
                <input
                    type="text"
                    placeholder="Filter by category"
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    style={{ marginRight: '0.5em' }}
                />
                <input
                    type="number"
                    placeholder="Max price"
                    value={priceFilter}
                    onChange={(e) => setPriceFilter(e.target.value)}
                    style={{ marginRight: '0.5em' }}
                />
                <input
                    type="number"
                    placeholder="Min stock"
                    value={stockFilter}
                    onChange={(e) => setStockFilter(e.target.value)}
                />
            </div>
            <ul>
                {items.map((item) => (
                    <li key={item.id}>
                        {item.name} - ${item.price.toFixed(2)}. {item.stock - (cartItems[item.id] || 0)} Left.
                        <button disabled={(item.stock - (cartItems[item.id] || 0)) > 0 ? false : true } onClick={() => addItemToCart(item.id, setCartItems)}>Add to cart</button>
                    </li>
                ))}
            </ul>
        </div>
    );

}

export default Shop;