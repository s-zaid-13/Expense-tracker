import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';
import CategoryChart from './CategoryChart';

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
        });
        setEditingId(expense.id);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div>
            <h2>Dashboard</h2>
            <button onClick={handleLogout}>Logout</button>

            <form onSubmit={handleSubmit}>
                <input
                    name="title"
                    placeholder="Title"
                    value={form.title}
                    onChange={handleChange}
                    required
                />
                <input
                    name="amount"
                    type="number"
                    placeholder="Amount"
                    value={form.amount}
                    onChange={handleChange}
                    required
                />
                <select name="category" value={form.category} onChange={handleChange}>
                    <option value="">Select Category</option>
                    <option value="Food">Food</option>
                    <option value="Transport">Transport</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Shopping">Shopping</option>
                    <option value="Bills">Bills</option>
                    <option value="Others">Others</option>
                </select>

                <input
                    name="date"
                    type="date"
                    value={form.date}
                    onChange={handleChange}
                    required
                />
                <button type="submit">{editingId ? 'Update' : 'Add'} Expense</button>
            </form>

            <ul>
                {expenses.map((exp) => (
                    <li key={exp.id}>
                        {exp.title} - ${exp.amount} on {exp.date} - {exp.category}
                        <button onClick={() => handleEdit(exp)}>Edit</button>
                        <button onClick={() => handleDelete(exp.id)}>Delete</button>
                    </li>
                ))}
            </ul>
            <CategoryChart expenses={expenses} />
        </div>
    );
}

export default Dashboard;
