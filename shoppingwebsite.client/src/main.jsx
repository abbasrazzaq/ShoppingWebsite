import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Login from './pages/Login.jsx'
/*import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)*/
function loginSuccess() {
    alert('You are logged in!');
}

createRoot(document.getElementById('root')).render(
    <StrictMode>
            <Login onLoginSuccess={ loginSuccess } />
    </StrictMode>
)