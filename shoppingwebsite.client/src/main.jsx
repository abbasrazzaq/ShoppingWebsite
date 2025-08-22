import { createRoot } from 'react-dom/client'
import './index.css'
import React from 'react'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);

//createRoot(document.getElementById('root')).render(
    

//    <StrictMode>
//        <BrowserRouter>
//            <Routes>
//                <Route path="/" element={<Login />} />
//                <Route path="/shop" element={<Shop cartItems={cartItems} setCartItems={setCartItems} />} />
//                <Route path="/cart" element={ <Cart /> } />
//            </Routes>
//        </BrowserRouter>
//    </StrictMode>
//)