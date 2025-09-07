import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css'

function Login({ setToken }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const result = await response.json();
            if (result.success) {
                setToken(result.accessToken);
                navigate('/shop');
            } else {
                setError('Login failed: invalid credentials');
            }
        } catch (err) {
            console.error(err);
            setError('Login request failed');
        }
    }

    return (
        <div className="login-wrap">
            <div className="login-content">
                <p className="welcome">Welcome to Abbas' Online Shop!</p>
                <h1 className="title">Enter login details</h1>
                <form onSubmit={handleLogin} className="login-form">
                    <label>
                        <span>USERNAME</span>
                        <input name="username" value={username} onChange={(e) => setUsername(e.target.value)} />
                    </label>
                    <label>
                        <span>PASSWORD</span>
                        <input name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </label>
                    {error && <div style={{ color: 'red' }}>{error}</div>}
                    <button type="submit" id="loginBtn">Login</button>

                </form>
            </div>
        </div>
    );
}

export default Login;