import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Shop from './pages/Shop.jsx'


createRoot(document.getElementById('root')).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} /> />
                <Route path="/shop" element={ <Shop /> } />
            </Routes>
        </BrowserRouter>
    </StrictMode>
)