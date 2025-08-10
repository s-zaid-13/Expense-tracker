import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import styles from './Category.module.css';

ChartJS.register(ArcElement, Tooltip, Legend);

function CategoryChart({ expenses }) {
    const categoryTotals = {};

    expenses.forEach(exp => {
        const cat = exp.category || 'Uncategorized';
        categoryTotals[cat] = (categoryTotals[cat] || 0) + parseFloat(exp.amount);
    });

    const data = {
        labels: Object.keys(categoryTotals),
        datasets: [
            {
                label: 'Expense by Category',
                data: Object.values(categoryTotals),
                backgroundColor: [
                    '#ff6384', '#36a2eb', '#ffcd56', '#4bc0c0',
                    '#9966ff', '#ff9f40', '#c9cbcf'
                ],
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className={styles.chartContainer}>
            <h3 className={styles.chartTitle}>Expenses by Category</h3>
            <Pie data={data} />
        </div>
    );
}

export default CategoryChart;
