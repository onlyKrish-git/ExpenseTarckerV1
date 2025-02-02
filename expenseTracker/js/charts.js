/**
 * Chart Manager for Expense Tracker
 * Handles all chart-related operations and updates
 */
class ChartManager {
    constructor() {
        this.expenseChart = null;
        this.categoryChart = null;
        this.initializeCharts();
    }

    // Initialize both charts
    initializeCharts() {
        this.createExpenseChart();
        this.createCategoryChart();
    }

    // Create the daily expense chart
    createExpenseChart() {
        const ctx = document.getElementById('expenseChart').getContext('2d');
        this.expenseChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Daily Expenses',
                    data: [],
                    borderColor: '#4CAF50',
                    tension: 0.1,
                    fill: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return storageManager.getCurrency() + value;
                            }
                        }
                    }
                }
            }
        });
    }

    // Create the category distribution chart
    createCategoryChart() {
        const ctx = document.getElementById('categoryChart').getContext('2d');
        this.categoryChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: [],
                datasets: [{
                    data: [],
                    backgroundColor: [
                        '#FF6384',
                        '#36A2EB',
                        '#FFCE56',
                        '#4BC0C0',
                        '#9966FF',
                        '#FF9F40'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right'
                    }
                }
            }
        });
    }

    // Update both charts with new data
    updateCharts() {
        this.updateExpenseChart();
        this.updateCategoryChart();
    }

    // Update the expense chart with daily data
    updateExpenseChart() {
        const expenses = storageManager.getMonthlyExpenses();
        const dailyTotals = {};

        // Calculate daily totals
        expenses.forEach(expense => {
            const date = expense.timestamp.split('T')[0];
            dailyTotals[date] = (dailyTotals[date] || 0) + expense.amount;
        });

        // Sort dates and prepare data
        const sortedDates = Object.keys(dailyTotals).sort();
        const data = sortedDates.map(date => dailyTotals[date]);
        const labels = sortedDates.map(date => new Date(date).toLocaleDateString());

        // Update chart data
        this.expenseChart.data.labels = labels;
        this.expenseChart.data.datasets[0].data = data;
        this.expenseChart.update();
    }

    // Update the category chart with distribution data
    updateCategoryChart() {
        const categoryTotals = storageManager.getCategoryTotals();
        
        // Prepare data for chart
        const labels = Object.keys(categoryTotals);
        const data = Object.values(categoryTotals);

        // Update chart data
        this.categoryChart.data.labels = labels;
        this.categoryChart.data.datasets[0].data = data;
        this.categoryChart.update();
    }

    // Update chart theme based on app theme
    updateChartTheme(isDark) {
        const textColor = isDark ? '#ffffff' : '#666666';
        
        // Update both charts
        [this.expenseChart, this.categoryChart].forEach(chart => {
            if (chart) {
                chart.options.plugins.legend.labels.color = textColor;
                chart.options.scales?.x?.ticks && (chart.options.scales.x.ticks.color = textColor);
                chart.options.scales?.y?.ticks && (chart.options.scales.y.ticks.color = textColor);
                chart.update();
            }
        });
    }
}

// Create and export a single instance
const chartManager = new ChartManager();