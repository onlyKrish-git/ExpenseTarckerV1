/**
 * Storage Manager for Expense Tracker
 * Handles all data persistence and management operations
 */
class StorageManager {
    constructor() {
        this.STORAGE_KEYS = {
            EXPENSES: 'expenses',
            BUDGET: 'monthlyBudget',
            CURRENCY: 'currency',
            THEME: 'theme'
        };
        this.initializeStorage();
    }

    // Initialize storage with default values if empty
    initializeStorage() {
        if (!localStorage.getItem(this.STORAGE_KEYS.EXPENSES)) {
            localStorage.setItem(this.STORAGE_KEYS.EXPENSES, JSON.stringify([]));
        }
        if (!localStorage.getItem(this.STORAGE_KEYS.BUDGET)) {
            localStorage.setItem(this.STORAGE_KEYS.BUDGET, '0');
        }
        if (!localStorage.getItem(this.STORAGE_KEYS.CURRENCY)) {
            localStorage.setItem(this.STORAGE_KEYS.CURRENCY, 'INR');
        }
        if (!localStorage.getItem(this.STORAGE_KEYS.THEME)) {
            localStorage.setItem(this.STORAGE_KEYS.THEME, 'light');
        }
    }

    // Expense Management
    getAllExpenses() {
        return JSON.parse(localStorage.getItem(this.STORAGE_KEYS.EXPENSES));
    }

    addExpense(expense) {
        const expenses = this.getAllExpenses();
        expense.id = Date.now(); // Add unique ID
        expense.timestamp = new Date().toISOString();
        expenses.push(expense);
        localStorage.setItem(this.STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
        return expense;
    }

    removeExpense(expenseId) {
        const expenses = this.getAllExpenses();
        const filteredExpenses = expenses.filter(exp => exp.id !== expenseId);
        localStorage.setItem(this.STORAGE_KEYS.EXPENSES, JSON.stringify(filteredExpenses));
    }

    // Budget Management
    getBudget() {
        return parseFloat(localStorage.getItem(this.STORAGE_KEYS.BUDGET)) || 0;
    }

    setBudget(amount) {
        localStorage.setItem(this.STORAGE_KEYS.BUDGET, amount.toString());
    }

    // Currency Management
    getCurrency() {
        return localStorage.getItem(this.STORAGE_KEYS.CURRENCY);
    }

    setCurrency(currency) {
        localStorage.setItem(this.STORAGE_KEYS.CURRENCY, currency);
    }

    // Theme Management
    getTheme() {
        return localStorage.getItem(this.STORAGE_KEYS.THEME);
    }

    setTheme(theme) {
        localStorage.setItem(this.STORAGE_KEYS.THEME, theme);
    }

    // Analytics Methods
    getTodayExpenses() {
        const expenses = this.getAllExpenses();
        const today = new Date().toISOString().split('T')[0];
        return expenses.filter(exp => exp.timestamp.startsWith(today));
    }

    getMonthlyExpenses() {
        const expenses = this.getAllExpenses();
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        return expenses.filter(exp => {
            const expDate = new Date(exp.timestamp);
            return expDate.getMonth() === currentMonth && 
                   expDate.getFullYear() === currentYear;
        });
    }

    getCategoryTotals() {
        const expenses = this.getAllExpenses();
        return expenses.reduce((acc, exp) => {
            acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
            return acc;
        }, {});
    }

    // Export/Import functionality
    exportData() {
        const data = {
            expenses: this.getAllExpenses(),
            budget: this.getBudget(),
            currency: this.getCurrency(),
            theme: this.getTheme(),
            exportDate: new Date().toISOString()
        };
        return JSON.stringify(data);
    }

    importData(jsonData) {
        try {
            const data = JSON.parse(jsonData);
            localStorage.setItem(this.STORAGE_KEYS.EXPENSES, JSON.stringify(data.expenses));
            localStorage.setItem(this.STORAGE_KEYS.BUDGET, data.budget.toString());
            localStorage.setItem(this.STORAGE_KEYS.CURRENCY, data.currency);
            localStorage.setItem(this.STORAGE_KEYS.THEME, data.theme);
            return true;
        } catch (error) {
            console.error('Error importing data:', error);
            return false;
        }
    }

    // Clear all data
    clearAllData() {
        Object.values(this.STORAGE_KEYS).forEach(key => {
            localStorage.removeItem(key);
        });
        this.initializeStorage();
    }
}

// Create and export a single instance
const storageManager = new StorageManager();