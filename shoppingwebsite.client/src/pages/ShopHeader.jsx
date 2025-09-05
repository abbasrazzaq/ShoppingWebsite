import { Link } from 'react-router-dom'

function ShopHeader({ cartItems }) {

    const cartItemsCount = Object.values(cartItems).reduce((total, count) => total + count, 0)

    return (
        <nav style={{
            display: 'flex',
            gap: '1rem',
            backgroundColor: '#f0f0f0',
            padding: '10px'
        }}>
            <Link to="/shop">Browse Shop</Link>
            <Link to="/cart">Cart ({cartItemsCount} items)</Link>
            {/*TODO: Logout*/}
        </nav>
    );
}

export default ShopHeader;