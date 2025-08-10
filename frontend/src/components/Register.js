import React, { useState } from 'react';
import API from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import styles from './Register.module.css';

function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');

        try {
            await API.post('/register', { username, password });
            alert('Registration successful!');
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.msg || 'Registration failed');
        }
    };

    return (
        <div className={styles.registerContainer}>
            <div className={styles.registerCard}>
                <h2 className={styles.title}>Register</h2>
                {error && <div className={styles.error}>{error}</div>}
                <form onSubmit={handleRegister}>
                    <input
                        type="text"
                        placeholder="Username"
                        className={styles.input}
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className={styles.input}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit" className={styles.button}>
                        Register
                    </button>
                    <p className={styles.switchText}>
                        Already have an account? <Link to="/login" className={styles.switchLink}>Login here</Link>
                    </p>

                </form>
            </div>
        </div>
    );
}

export default Register;
