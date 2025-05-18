import React, { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigator = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const res = await API.post('/login', { username, password });
            localStorage.setItem('token', res.data.token);
            navigator('/dashboard')
        } catch (error) {
            alert(error.response.data.msg || 'login failed');
        }
    };


    return (
        <form onSubmit={handleLogin}>
            <h2>Login</h2>
            <input type="text" placeholder="Username" value={username}
                onChange={(e) => setUsername(e.target.value)} required />
            <input type="password" placeholder="Password" value={password}
                onChange={(e) => setPassword(e.target.value)} required />
            <button type="submit">Login</button>
        </form>
    );
}
export default Login;