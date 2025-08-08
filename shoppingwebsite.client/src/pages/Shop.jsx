import { useState, useEffect } from 'react';

function Shop() {
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

    return (
        <div>
            <h2>Shop Items</h2>
            <ul>
                {items.map((item) => (
                    <li key={item.id}>
                        {item.name} - ${item.price.toFixed(2)}
                    </li>
                ))}
            </ul>
        </div>
    );

}

export default Shop;