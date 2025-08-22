import { Link } from 'react-router-dom'

function ShopHeader() {
    return (
        <nav>
            <Link to="/cart">View Cart</Link>
        </nav>
    );
}

export default ShopHeader;