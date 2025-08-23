import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Cart({ cartItems, setCartItems }) {
    // List all the items in your cart, including how many.
    // Do a total of the cost.
    // When clicking "Checkout", your balance goes down.

    // Use the id to collect further info about the items

    const [loading, setLoading] = useState(true);
    const [items, setItems] = useState([]);
    const navigate = useNavigate();


    useEffect(() => {

        async function populateCartItems() {
            try {
                const ids = Object.keys(cartItems);
                const response = await fetch('api/cart/getcartitems', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(ids),
                });

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }

                const data = await response.json();
                setItems(data);
            }
            catch (err) {
                console.error('Failed to loading shopping cart: ' + err);
            }
            finally {
                setLoading(false);
            }
        }

        populateCartItems(cartItems);

    }, []);


    async function buyItems() {

        const cartItemsAsInts = Object.keys(cartItems).map(key => ({
            ItemId: parseInt(key, 10),
            ItemCount: cartItems[key]
        }));

        const response = await fetch('api/cart/buyitems', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(cartItemsAsInts),
        }); 

        if (response.ok) {
            alert('Bought items!');

            setCartItems([]);
            navigate('/shop');
        }
        else {
            alert(`Fail: ${response.status}`);
        }
    }

    if(loading) return <div>Loading shopping cart... </div>

    let total = 0;
    for (let i = 0; i < items.length; i++) {
        total += items[i].price * cartItems[items[i].id];
    }
    return (
        <div>
            <h2>Cart</h2>
            <ul>
                {items.map((item) => (
                    <li key={item.id}>
                        Item: {item.name}, Count: {cartItems[item.id]}
                    </li>
                ))}
                {/*{Object.entries(cartItems).map(([id, count]) => (*/}
                {/*    <li key={id}>*/}
                {/*        Item ID: {id}, Count: {count}*/}
                {/*    </li>*/}
                {/*))}*/}
            </ul>
            <h3>Total: ${total}</h3>

            <button onClick={() => { buyItems(); } }>Buy Items!</button>
        </div>
       
    );
}

export default Cart;