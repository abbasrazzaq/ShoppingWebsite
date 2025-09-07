import { Link, useLocation } from 'react-router-dom';
import './ShopHeader.css';

function ShopHeader({ cartItems, setToken }) {
    const location = useLocation();

    const cartItemsCount = Object.values(cartItems).reduce(
        (total, count) => total + count,
        0);

    function handleLogout() {
        setToken(null);
    }

    return (
        <nav className="shop-nav">
            { location.pathname !== '/shop' &&
                <Link to="/shop">
                    Browse Shop
                </Link>
            }
            { location.pathname !== '/cart' &&
                <Link to="/cart">
                    Cart ({cartItemsCount} items)
                </Link>
            }
            <div style={{ marginLeft: 'auto' } }>
                <Link className="login" to="/" onClick={ handleLogout }>
                    Logout
                </Link>
            </div>
            
        </nav>
    );
}

export default ShopHeader;