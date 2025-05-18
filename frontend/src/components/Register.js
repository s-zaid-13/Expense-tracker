import React, { useState } from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';

function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await API.post('/register', { username, password });
            alert('Registration successful!');
            navigate('/login');
        } catch (err) {
            alert(err.response.data.msg || 'Registration failed');
        }
    };

    return (
        <form onSubmit={handleRegister}>
            <h2>Register</h2>
            <input type="text" placeholder="Username" value={username}
                onChange={(e) => setUsername(e.target.value)} required />
            <input type="password" placeholder="Password" value={password}
                onChange={(e) => setPassword(e.target.value)} required />
            <button type="submit">Register</button>
        </form>
    );
}

export default Register;
