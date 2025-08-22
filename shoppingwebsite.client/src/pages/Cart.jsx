import { useState, useEffect } from 'react';

function Cart({ cartItems }) {
    // List all the items in your cart, including how many.
    // Do a total of the cost.
    // When clicking "Checkout", your balance goes down.

    // Use the id to collect further info about the items

    const [loading, setLoading] = useState(true);
    const [items, setItems] = useState([]);

    useEffect(() => {

        async function populateCartItems() {
            try {
                
                // Pull out just the ids
                const ids = Object.keys(cartItems);
                console.info('cart items:' + JSON.stringify(ids));
                const response = await fetch('api/cart/getcartitems', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(ids),
                });

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }

                const data = await response.json();
                //console.info(result);

                // Fill the uls
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

    if(loading) return <div>Loading shopping cart... </div>

    return (
        <div>
            <h2>Cart</h2>
            <ul>
                {items.map((item) => (
                    <li key={item.id}>{item.name}</li>
                ))}
                {/*{Object.entries(cartItems).map(([id, count]) => (*/}
                {/*    <li key={id}>*/}
                {/*        Item ID: {id}, Count: {count}*/}
                {/*    </li>*/}
                {/*))}*/}
            </ul>
        </div>
       
    );
}

export default Cart;