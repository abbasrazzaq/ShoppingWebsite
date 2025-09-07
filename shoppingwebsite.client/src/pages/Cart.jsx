import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast'
import apiFetch from '../services/api'
import './Shop.css';
import './Cart.css'

function Cart({ cartItems, setCartItems, token }) {
    // List all the items in your cart, including how many.
    // Do a total of the cost.
    // When clicking "Checkout", your balance goes down.

    // Use the id to collect further info about the items

    const [loading, setLoading] = useState(true);
    const [cartList, setCartList] = useState([]);
    const [bankBalance, setBankBalance] = useState(null);
    const [itemsTotal, setItemsTotal] = useState(0);
    const navigate = useNavigate();

    // Calculate cart total
    useEffect(() => {
        let total = 0;
        for (let i = 0; i < cartList.length; i++) {
            total += cartList[i].price * cartItems[cartList[i].id];
        }
        setItemsTotal(total);
    }, [cartList, cartItems]);

    // Calculate user's bank balance
    useEffect(() => {
        async function loadBankBalance() {
            const response = await apiFetch('api/cart/getbankbalance', token);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const data = await response.json();
            setBankBalance(data);
        }

        loadBankBalance();
    }, []);

    // Populate list of items
    useEffect(() => {

        async function populateCartItems() {
            try {
                const ids = Object.keys(cartItems);
                if (ids.length > 0) {
                    const response = await apiFetch('api/cart/getcartitems', token, {
                        method: 'POST',
                        body: ids,
                    });

                    if (!response.ok) {
                        throw new Error(`HTTP ${response.status}`);
                    }

                    const data = await response.json();
                    setCartList(data);
                }
            }
            catch (err) {
                console.error('Failed to load shopping cart: ' + err);
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

        const response = await apiFetch('api/cart/buyitems', token, {
            method: 'POST',
            body: cartItemsAsInts,
        });

        if (response.ok) {
            toast.success('Items bought! Expect delivery within 1-2 working days!');

            setCartItems([]);
            navigate('/shop');
        }
        else {
            toast.error(`Failed to buy items! Server responded with: ${response.status}`);
        }
    }

    if(loading) return <div>Loading shopping cart... </div>

    function removeItemFromCart(itemId, setCartItems) {
        let itemRemoved = false;

        setCartItems(prev => {
            const currentCount = prev[itemId];
            if (currentCount <= 1) {
                // Remove item from cart
                const { [itemId]: _, ...rest } = prev;
                itemRemoved = true;
                return rest;
            }

            return {
                ...prev,
                [itemId] : currentCount - 1
            };
        });

        if (itemRemoved) {
            setCartList(prev => prev.filter(item => item.id != itemId));
        }
    }

    return (
        <div className="shop-wrap">
            <div className="shop-content">
                <h2>Cart</h2>
                <ul className="item-list">
                    {cartList.map((item) => (
                        <li key={item.id}>
                            <img
                                src={`/src/assets/items/${item.id}.png`}
                                onError={(e) => e.target.src = '/src/assets/items/placeholder.jpg'}
                                style={{ width: '100px' }}
                            >
                            </img>
                            <div className="item-details">
                                {item.name}
                                <div>
                                    Count: {cartItems[item.id]}
                                </div>
                            </div>
                            
                            <button onClick={() => removeItemFromCart(item.id, setCartItems)}>Remove</button>
                        </li>
                    ))}
                </ul>
                <h3 className="cart-content-h3">Cart Total: ${itemsTotal}</h3>
                <h3 className="cart-content-h4">Your Balance: ${bankBalance}</h3>

                {(itemsTotal > bankBalance) && (
                    <h4 style={{ color: "red" }}>Not enough balance!</h4>
                )}

                <button className="cart-content-button"
                    disabled={(itemsTotal > bankBalance) || cartList.length < 1}
                    onClick={() => { buyItems(); }}>
                    Buy Items!
                </button>
            </div>
        </div>
       
    );
}

export default Cart;