import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';
import CategoryChart from './CategoryChart';
import styles from './Dashboard.module.css';

function Dashboard() {
    const [expenses, setExpenses] = useState([]);
    const [form, setForm] = useState({
        title: '', amount: '', date: '', category: ''
    });

    const [editingId, setEditingId] = useState(null);
    const navigate = useNavigate();

    const token = localStorage.getItem('token');
    if (!token) navigate('/login');

    const config = { headers: { Authorization: `Bearer ${token}` } };

    const fetchExpenses = async () => {
        const res = await API.get('/expenses', config);
        setExpenses(res.data);
    };

    useEffect(() => {
        fetchExpenses();
    }, []);

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await API.put(`/expenses/${editingId}`, form, config);
            } else {
                await API.post('/expenses', form, config);
            }
            setForm({ title: '', amount: '', date: '', category: '' });
            setEditingId(null);
            fetchExpenses();
        } catch (err) {
            alert('Error: ' + err.response?.data?.msg);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this expense?')) {
            try {
                await API.delete(`/expenses/${id}`, config);
                fetchExpenses();
            } catch (err) {
                alert('Delete failed: ' + err.response?.data?.msg || err.message);
            }
        }
    };

    const handleEdit = (expense) => {
        setForm({
            title: expense.title,
            amount: expense.amount,
            date: expense.date,
            category: expense.category
        });
        setEditingId(expense.id);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div className={styles.dashboardContainer}>
            <div className={styles.headerRow}>
                <h2 className={styles.title}>Dashboard</h2>
                <button onClick={handleLogout} className={styles.logoutButton}>Logout</button>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
                <input
                    className={styles.input}
                    name="title"
                    placeholder="Title"
                    value={form.title}
                    onChange={handleChange}
                    required
                />
                <input
                    className={styles.input}
                    name="amount"
                    type="number"
                    placeholder="Amount"
                    value={form.amount}
                    onChange={handleChange}
                    required
                />
                <select
                    className={styles.select}
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                >
                    <option value="">Select Category</option>
                    <option value="Food">Food</option>
                    <option value="Transport">Transport</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Shopping">Shopping</option>
                    <option value="Bills">Bills</option>
                    <option value="Others">Others</option>
                </select>

                <input
                    className={styles.dateInput}
                    name="date"
                    type="date"
                    value={form.date}
                    onChange={handleChange}
                    required
                />
                <button type="submit" className={styles.submitButton}>
                    {editingId ? 'Update' : 'Add'} Expense
                </button>
            </form>

            <ul className={styles.expenseList}>
                {expenses.map((exp) => (
                    <li key={exp.id} className={styles.expenseItem}>
                        <span className={styles.expenseDetails}>
                            {exp.title} - ${exp.amount} on {exp.date} - {exp.category}
                        </span>
                        <div className={styles.actionButtons}>
                            <button
                                onClick={() => handleEdit(exp)}
                                className={styles.editButton}
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => handleDelete(exp.id)}
                                className={styles.deleteButton}
                            >
                                Delete
                            </button>
                        </div>
                    </li>
                ))}
            </ul>

            <div className={styles.chartWrapper}>
                <CategoryChart expenses={expenses} />
            </div>
        </div>
    );
}

export default Dashboard;
