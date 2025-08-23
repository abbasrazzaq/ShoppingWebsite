import { useState, useEffect } from 'react';

function Shop( { cartItems, setCartItems } ) {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function populateShopItems() {
            try {
                const response = await fetch('api/shop');
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

    }, []);


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