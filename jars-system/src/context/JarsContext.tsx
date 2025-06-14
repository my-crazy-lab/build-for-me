import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Income, Expense, FinancialGoal, Transaction, DashboardStats, JarAllocations } from '../types';
import { useAuth } from './AuthContext';

interface JarsContextType {
  incomes: Income[];
  expenses: Expense[];
  goals: FinancialGoal[];
  transactions: Transaction[];
  dashboardStats: DashboardStats;
  addIncome: (income: Omit<Income, 'id' | 'userId'>) => void;
  addExpense: (expense: Omit<Expense, 'id' | 'userId'>) => void;
  addGoal: (goal: Omit<FinancialGoal, 'id' | 'userId' | 'isCompleted'>) => void;
  updateGoal: (goalId: string, updates: Partial<FinancialGoal>) => void;
  deleteTransaction: (transactionId: string) => void;
  calculateJarBalances: () => Record<keyof JarAllocations, number>;
  refreshData: () => void;
}

const JarsContext = createContext<JarsContextType | undefined>(undefined);

export const useJars = () => {
  const context = useContext(JarsContext);
  if (context === undefined) {
    throw new Error('useJars must be used within a JarsProvider');
  }
  return context;
};

interface JarsProviderProps {
  children: ReactNode;
}

export const JarsProvider: React.FC<JarsProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [goals, setGoals] = useState<FinancialGoal[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    totalIncome: 0,
    totalExpenses: 0,
    totalBalance: 0,
    jarBalances: {
      necessities: 0,
      education: 0,
      longterm: 0,
      play: 0,
      financial: 0,
      give: 0,
    },
    monthlyIncome: 0,
    monthlyExpenses: 0,
    savingsRate: 0,
  });

  useEffect(() => {
    if (user) {
      loadUserData();
    } else {
      // Clear data when user logs out
      setIncomes([]);
      setExpenses([]);
      setGoals([]);
      setTransactions([]);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      calculateDashboardStats();
    }
  }, [incomes, expenses, user]);

  const loadUserData = () => {
    if (!user) return;

    const userIncomes = JSON.parse(localStorage.getItem(`jars_incomes_${user.id}`) || '[]');
    const userExpenses = JSON.parse(localStorage.getItem(`jars_expenses_${user.id}`) || '[]');
    const userGoals = JSON.parse(localStorage.getItem(`jars_goals_${user.id}`) || '[]');
    const userTransactions = JSON.parse(localStorage.getItem(`jars_transactions_${user.id}`) || '[]');

    setIncomes(userIncomes);
    setExpenses(userExpenses);
    setGoals(userGoals);
    setTransactions(userTransactions);
  };

  const addIncome = (incomeData: Omit<Income, 'id' | 'userId'>) => {
    if (!user) return;

    const newIncome: Income = {
      ...incomeData,
      id: Date.now().toString(),
      userId: user.id,
    };

    const updatedIncomes = [...incomes, newIncome];
    setIncomes(updatedIncomes);
    localStorage.setItem(`jars_incomes_${user.id}`, JSON.stringify(updatedIncomes));

    // Add to transactions
    const newTransaction: Transaction = {
      id: Date.now().toString() + '_income',
      type: 'income',
      amount: newIncome.amount,
      description: newIncome.description || newIncome.source,
      date: newIncome.date,
      userId: user.id,
    };

    const updatedTransactions = [...transactions, newTransaction];
    setTransactions(updatedTransactions);
    localStorage.setItem(`jars_transactions_${user.id}`, JSON.stringify(updatedTransactions));
  };

  const addExpense = (expenseData: Omit<Expense, 'id' | 'userId'>) => {
    if (!user) return;

    const newExpense: Expense = {
      ...expenseData,
      id: Date.now().toString(),
      userId: user.id,
    };

    const updatedExpenses = [...expenses, newExpense];
    setExpenses(updatedExpenses);
    localStorage.setItem(`jars_expenses_${user.id}`, JSON.stringify(updatedExpenses));

    // Add to transactions
    const newTransaction: Transaction = {
      id: Date.now().toString() + '_expense',
      type: 'expense',
      amount: newExpense.amount,
      description: newExpense.description,
      date: newExpense.date,
      jarId: newExpense.jarId,
      category: newExpense.category,
      userId: user.id,
    };

    const updatedTransactions = [...transactions, newTransaction];
    setTransactions(updatedTransactions);
    localStorage.setItem(`jars_transactions_${user.id}`, JSON.stringify(updatedTransactions));
  };

  const addGoal = (goalData: Omit<FinancialGoal, 'id' | 'userId' | 'isCompleted'>) => {
    if (!user) return;

    const newGoal: FinancialGoal = {
      ...goalData,
      id: Date.now().toString(),
      userId: user.id,
      isCompleted: false,
    };

    const updatedGoals = [...goals, newGoal];
    setGoals(updatedGoals);
    localStorage.setItem(`jars_goals_${user.id}`, JSON.stringify(updatedGoals));
  };

  const updateGoal = (goalId: string, updates: Partial<FinancialGoal>) => {
    if (!user) return;

    const updatedGoals = goals.map(goal =>
      goal.id === goalId ? { ...goal, ...updates } : goal
    );
    setGoals(updatedGoals);
    localStorage.setItem(`jars_goals_${user.id}`, JSON.stringify(updatedGoals));
  };

  const deleteTransaction = (transactionId: string) => {
    if (!user) return;

    const updatedTransactions = transactions.filter(t => t.id !== transactionId);
    setTransactions(updatedTransactions);
    localStorage.setItem(`jars_transactions_${user.id}`, JSON.stringify(updatedTransactions));

    // Also remove from incomes or expenses
    if (transactionId.includes('_income')) {
      const incomeId = transactionId.replace('_income', '');
      const updatedIncomes = incomes.filter(i => i.id !== incomeId);
      setIncomes(updatedIncomes);
      localStorage.setItem(`jars_incomes_${user.id}`, JSON.stringify(updatedIncomes));
    } else if (transactionId.includes('_expense')) {
      const expenseId = transactionId.replace('_expense', '');
      const updatedExpenses = expenses.filter(e => e.id !== expenseId);
      setExpenses(updatedExpenses);
      localStorage.setItem(`jars_expenses_${user.id}`, JSON.stringify(updatedExpenses));
    }
  };

  const calculateJarBalances = (): Record<keyof JarAllocations, number> => {
    if (!user) {
      return {
        necessities: 0,
        education: 0,
        longterm: 0,
        play: 0,
        financial: 0,
        give: 0,
      };
    }

    const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);
    const allocations = user.preferences.jarAllocations;
    
    const allocated = {
      necessities: (totalIncome * allocations.necessities) / 100,
      education: (totalIncome * allocations.education) / 100,
      longterm: (totalIncome * allocations.longterm) / 100,
      play: (totalIncome * allocations.play) / 100,
      financial: (totalIncome * allocations.financial) / 100,
      give: (totalIncome * allocations.give) / 100,
    };

    const spent = {
      necessities: expenses.filter(e => e.jarId === 'necessities').reduce((sum, e) => sum + e.amount, 0),
      education: expenses.filter(e => e.jarId === 'education').reduce((sum, e) => sum + e.amount, 0),
      longterm: expenses.filter(e => e.jarId === 'longterm').reduce((sum, e) => sum + e.amount, 0),
      play: expenses.filter(e => e.jarId === 'play').reduce((sum, e) => sum + e.amount, 0),
      financial: expenses.filter(e => e.jarId === 'financial').reduce((sum, e) => sum + e.amount, 0),
      give: expenses.filter(e => e.jarId === 'give').reduce((sum, e) => sum + e.amount, 0),
    };

    return {
      necessities: allocated.necessities - spent.necessities,
      education: allocated.education - spent.education,
      longterm: allocated.longterm - spent.longterm,
      play: allocated.play - spent.play,
      financial: allocated.financial - spent.financial,
      give: allocated.give - spent.give,
    };
  };

  const calculateDashboardStats = () => {
    if (!user) return;

    const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const totalBalance = totalIncome - totalExpenses;
    const jarBalances = calculateJarBalances();

    // Calculate monthly stats (current month)
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthlyIncome = incomes
      .filter(income => {
        const incomeDate = new Date(income.date);
        return incomeDate.getMonth() === currentMonth && incomeDate.getFullYear() === currentYear;
      })
      .reduce((sum, income) => sum + income.amount, 0);

    const monthlyExpenses = expenses
      .filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
      })
      .reduce((sum, expense) => sum + expense.amount, 0);

    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

    setDashboardStats({
      totalIncome,
      totalExpenses,
      totalBalance,
      jarBalances,
      monthlyIncome,
      monthlyExpenses,
      savingsRate,
    });
  };

  const refreshData = () => {
    if (user) {
      loadUserData();
    }
  };

  const value: JarsContextType = {
    incomes,
    expenses,
    goals,
    transactions,
    dashboardStats,
    addIncome,
    addExpense,
    addGoal,
    updateGoal,
    deleteTransaction,
    calculateJarBalances,
    refreshData,
  };

  return (
    <JarsContext.Provider value={value}>
      {children}
    </JarsContext.Provider>
  );
};
