import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
        <div>
            <h1>Login</h1>
            <form onSubmit={handleLogin}>
                <label>Username:</label>
                <input name="username" value={username} onChange={(e) => setUsername(e.target.value)} />
                <br />
                <label>Password:</label>
                <input name="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <br />
                {error && <div style={{ color: 'red' }}>{ error }</div>}
                <button type="submit" id="loginBtn">Login</button>

            </form>
        </div>
    );
}

export default Login;