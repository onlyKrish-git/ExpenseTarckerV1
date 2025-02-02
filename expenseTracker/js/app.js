/**
 * Main Application Class for Expense Tracker
 * Handles core functionality and UI interactions
 */
class ExpenseTracker {
    constructor() {
        this.initializeApp();
        this.setupEventListeners();
    }

    // Initialize the application
    initializeApp() {
        this.loadTheme();
        this.loadCurrency();
        this.updateStats();
        this.displayExpenses();
        chartManager.updateCharts();
    }

    // Set up all event listeners
    setupEventListeners() {
        // Form submission
        document.getElementById('expenseForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleExpenseSubmission();
        });

        // Theme toggle
        document.getElementById('themeToggle').addEventListener('click', () => {
            this.toggleTheme();
        });

        // Currency selector
        document.getElementById('currencySelector').addEventListener('change', (e) => {
            storageManager.setCurrency(e.target.value);
            this.updateStats();
            chartManager.updateCharts();
        });

        // Budget input
        document.getElementById('budgetInput').addEventListener('change', (e) => {
            this.handleBudgetUpdate(e.target.value);
        });
    }

    // Handle new expense submission
    handleExpenseSubmission() {
        const amount = parseFloat(document.getElementById('amount').value);
        const description = document.getElementById('description').value;
        const category = document.getElementById('category').value;

        if (amount && description) {
            const expense = {
                amount,
                description,
                category
            };

            storageManager.addExpense(expense);
            this.updateStats();
            this.displayExpenses();
            chartManager.updateCharts();

            // Reset form
            document.getElementById('expenseForm').reset();
            
            // Show success notification
            this.showNotification('Expense added successfully!', 'success');
        }
    }

    // Quick add preset expense
    quickAdd(description, amount, category) {
        const expense = { amount, description, category };
        storageManager.addExpense(expense);
        this.updateStats();
        this.displayExpenses();
        chartManager.updateCharts();
    }

    // Display expenses in the list
    displayExpenses() {
        const expenseList = document.getElementById('expenseList');
        const expenses = storageManager.getTodayExpenses();
        const currency = storageManager.getCurrency();

        expenseList.innerHTML = expenses.map(expense => `
            <div class="expense-item fade-in">
                <div>
                    <strong>${expense.description}</strong>
                    <span class="badge bg-secondary">${expense.category}</span>
                </div>
                <div class="d-flex align-items-center">
                    <span class="me-2">${currency}${expense.amount}</span>
                    <button class="btn btn-sm btn-danger delete-btn" 
                            onclick="expenseTracker.removeExpense(${expense.id})">
                        ×
                    </button>
                </div>
            </div>
        `).join('');
    }

    // Remove an expense
    removeExpense(expenseId) {
        storageManager.removeExpense(expenseId);
        this.updateStats();
        this.displayExpenses();
        chartManager.updateCharts();
        this.showNotification('Expense removed successfully!', 'info');
    }

    // Update all statistics
    updateStats() {
        const currency = storageManager.getCurrency();
        const budget = storageManager.getBudget();
        const todayExpenses = storageManager.getTodayExpenses();
        const monthlyExpenses = storageManager.getMonthlyExpenses();

        const todayTotal = todayExpenses.reduce((sum, exp) => sum + exp.amount, 0);
        const monthlyTotal = monthlyExpenses.reduce((sum, exp) => sum + exp.amount, 0);
        const remaining = Math.max(0, budget - monthlyTotal);

        // Update UI elements
        document.getElementById('monthlyBudgetDisplay').textContent = `${currency}${budget}`;
        document.getElementById('todaySpending').textContent = `${currency}${todayTotal}`;
        document.getElementById('monthlySpending').textContent = `${currency}${monthlyTotal}`;
        document.getElementById('remainingBudget').textContent = `${currency}${remaining}`;

        // Check budget alerts
        this.checkBudgetAlerts(monthlyTotal, budget);
    }

    // Handle budget updates
    handleBudgetUpdate(value) {
        const budget = parseFloat(value);
        if (!isNaN(budget) && budget >= 0) {
            storageManager.setBudget(budget);
            this.updateStats();
            this.showNotification('Budget updated successfully!', 'success');
        }
    }

    // Theme management
    toggleTheme() {
        const currentTheme = storageManager.getTheme();
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        storageManager.setTheme(newTheme);
        this.loadTheme();
    }

    loadTheme() {
        const theme = storageManager.getTheme();
        document.body.setAttribute('data-theme', theme);
        chartManager.updateChartTheme(theme === 'dark');
    }

    // Currency management
    loadCurrency() {
        const currency = storageManager.getCurrency();
        document.getElementById('currencySelector').value = currency;
    }

    // Budget alerts
    checkBudgetAlerts(totalSpent, budget) {
        if (budget === 0) return;

        const spentPercentage = (totalSpent / budget) * 100;
        if (spentPercentage >= 90) {
            this.showNotification('Warning: You have spent 90% of your budget!', 'warning');
        } else if (spentPercentage >= 75) {
            this.showNotification('Notice: You have spent 75% of your budget.', 'info');
        }
    }

    // Notification system
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `alert alert-${type} fade-in`;
        notification.style.position = 'fixed';
        notification.style.top = '20px';
        notification.style.right = '20px';
        notification.style.zIndex = '1000';
        notification.textContent = message;

        // Add to document
        document.body.appendChild(notification);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Create and initialize the expense tracker
const expenseTracker = new ExpenseTracker();