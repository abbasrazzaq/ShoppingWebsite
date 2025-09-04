import Login from './pages/Login.jsx'
import Shop from './pages/Shop.jsx'
import Cart from './pages/Cart.jsx'
import ShopHeader from './pages/ShopHeader.jsx'
import PrivateRoute from './components/PrivateRoute.jsx'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useState } from 'react'

function AppContent({ cartItems, setCartItems, token, setToken }) {
    const location = useLocation();
    const showHeader = ['/shop', '/cart'].includes(location.pathname);

    return (
        <>
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


//import { useEffect, useState } from 'react';
//import './App.css';

//function App() {
//    const [forecasts, setForecasts] = useState();

//    useEffect(() => {
//        populateWeatherData();
//    }, []);

//    const contents = forecasts === undefined
//        ? <p><em>Loading... Please refresh once the ASP.NET backend has started. See <a href="https://aka.ms/jspsintegrationreact">https://aka.ms/jspsintegrationreact</a> for more details.</em></p>
//        : <table className="table table-striped" aria-labelledby="tableLabel">
//            <thead>
//                <tr>
//                    <th>Date</th>
//                    <th>Temp. (C)</th>
//                    <th>Temp. (F)</th>
//                    <th>Summary</th>
//                </tr>
//            </thead>
//            <tbody>
//                {forecasts.map(forecast =>
//                    <tr key={forecast.date}>
//                        <td>{forecast.date}</td>
//                        <td>{forecast.temperatureC}</td>
//                        <td>{forecast.temperatureF}</td>
//                        <td>{forecast.summary}</td>
//                    </tr>
//                )}
//            </tbody>
//        </table>;

//    return (
//        <div>
//            <h1 id="tableLabel">Weather forecast</h1>
//            <p>This component demonstrates fetching data from the server.</p>
//            {contents}
//        </div>
//    );
    
//    async function populateWeatherData() {
//        const response = await fetch('weatherforecast');
//        if (response.ok) {
//            const data = await response.json();
//            setForecasts(data);
//        }
//    }
//}

//export default App;