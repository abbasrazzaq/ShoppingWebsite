import Login from './pages/Login.jsx'
import Shop from './pages/Shop.jsx'
import Cart from './pages/Cart.jsx'
import ShopHeader from './pages/ShopHeader.jsx'
import PrivateRoute from './components/PrivateRoute.jsx'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useState } from 'react'

function AppContent({ cartItems, setCartItems, token, setToken }) {
    const location = useLocation();
    const showHeader = ['/shop', '/cart'].includes(location.pathname);

    return (
        <>
            <Toaster />
            {showHeader && <ShopHeader cartItems={cartItems} />}
            <Routes>
                {/*Login page is public*/}
                <Route path="/" element={<Login setToken={setToken} />} />

                <Route path="/shop"
                    element={
                        <PrivateRoute token={token}>
                            <Shop cartItems={cartItems} setCartItems={setCartItems} token={token} />
                        </PrivateRoute>
                    } />
                <Route path="/cart"
                    element={
                        <PrivateRoute token={token}>
                            <Cart cartItems={cartItems} setCartItems={setCartItems} token={token} />
                        </PrivateRoute>
                    } />
            </Routes>
        </>
    );
}

function App() {
    const [cartItems, setCartItems] = useState([]);
    const [token, setToken] = useState(null);
   
    return (
        <BrowserRouter>
            <AppContent cartItems={cartItems} setCartItems={setCartItems} token={token} setToken={setToken} />
        </BrowserRouter>
    );
}

export default App;