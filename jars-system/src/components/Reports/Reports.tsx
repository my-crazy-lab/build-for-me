import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Download, Calendar, TrendingUp, TrendingDown } from 'lucide-react';
import { useJars } from '../../context/JarsContext';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency, getMonthlyData, exportToCSV, generateFinancialReport } from '../../utils/jarCalculations';

const Reports: React.FC = () => {
  const { incomes, expenses, transactions } = useJars();
  const { user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState<'month' | 'quarter' | 'year'>('month');

  // Generate monthly data for charts
  const monthlyIncomeData = getMonthlyData(
    incomes.map(income => ({ date: income.date, amount: income.amount })),
    6
  );

  const monthlyExpenseData = getMonthlyData(
    expenses.map(expense => ({ date: expense.date, amount: expense.amount })),
    6
  );

  // Combine income and expense data for comparison chart
  const combinedMonthlyData = monthlyIncomeData.map((income, index) => ({
    month: income.month,
    income: income.amount,
    expenses: monthlyExpenseData[index]?.amount || 0,
    savings: income.amount - (monthlyExpenseData[index]?.amount || 0),
  }));

  // Generate expense data by JAR
  const expensesByJar = expenses.reduce((acc, expense) => {
    acc[expense.jarId] = (acc[expense.jarId] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const jarExpenseData = Object.entries(expensesByJar).map(([jarId, amount]) => ({
    jar: jarId.charAt(0).toUpperCase() + jarId.slice(1),
    amount,
  }));

  // Generate financial report
  const report = generateFinancialReport(incomes, expenses, selectedPeriod);

  const handleExportTransactions = () => {
    const exportData = transactions.map(transaction => ({
      Date: new Date(transaction.date).toLocaleDateString(),
      Type: transaction.type,
      Amount: transaction.amount,
      Description: transaction.description,
      JAR: transaction.jarId || '',
      Category: transaction.category || '',
    }));

    exportToCSV(exportData, `jars-transactions-${new Date().toISOString().split('T')[0]}.csv`);
  };

  const handleExportReport = () => {
    const reportData = [
      {
        Period: selectedPeriod,
        'Start Date': report.startDate.toLocaleDateString(),
        'End Date': report.endDate.toLocaleDateString(),
        'Total Income': report.totalIncome,
        'Total Expenses': report.totalExpenses,
        'Net Savings': report.netSavings,
        'Savings Rate': `${report.savingsRate.toFixed(1)}%`,
      }
    ];

    exportToCSV(reportData, `jars-report-${selectedPeriod}-${new Date().toISOString().split('T')[0]}.csv`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Reports & Analytics</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Analyze your financial patterns and trends
          </p>
        </div>
        <div className="flex space-x-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value as 'month' | 'quarter' | 'year')}
            className="input-field"
          >
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          <button
            onClick={handleExportTransactions}
            className="btn-secondary flex items-center"
          >
            <Download className="h-4 w-4 mr-2" />
            Export Transactions
          </button>
          <button
            onClick={handleExportReport}
            className="btn-primary flex items-center"
          >
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="jar-card">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Period Income
              </h3>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(report.totalIncome)}
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="jar-card">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Period Expenses
              </h3>
              <p className="text-2xl font-bold text-red-600">
                {formatCurrency(report.totalExpenses)}
              </p>
            </div>
            <TrendingDown className="h-8 w-8 text-red-600" />
          </div>
        </div>

        <div className="jar-card">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Net Savings
              </h3>
              <p className={`text-2xl font-bold ${report.netSavings >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(report.netSavings)}
              </p>
            </div>
            <Calendar className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="jar-card">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Savings Rate
              </h3>
              <p className={`text-2xl font-bold ${report.savingsRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {report.savingsRate.toFixed(1)}%
              </p>
            </div>
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-blue-600 font-bold text-sm">%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income vs Expenses Trend */}
        <div className="jar-card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Income vs Expenses Trend (6 Months)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={combinedMonthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => `$${value}`} />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Legend />
              <Line type="monotone" dataKey="income" stroke="#10b981" strokeWidth={2} name="Income" />
              <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} name="Expenses" />
              <Line type="monotone" dataKey="savings" stroke="#3b82f6" strokeWidth={2} name="Savings" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Expenses by JAR */}
        <div className="jar-card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Expenses by JAR
          </h3>
          {jarExpenseData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={jarExpenseData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="jar" />
                <YAxis tickFormatter={(value) => `$${value}`} />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Bar dataKey="amount" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
              <p>No expense data available</p>
            </div>
          )}
        </div>
      </div>

      {/* Detailed Report */}
      <div className="jar-card">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Detailed {selectedPeriod.charAt(0).toUpperCase() + selectedPeriod.slice(1)} Report
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">Summary</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Period:</span>
                <span className="font-medium">
                  {report.startDate.toLocaleDateString()} - {report.endDate.toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Income Transactions:</span>
                <span className="font-medium">{report.incomeCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Expense Transactions:</span>
                <span className="font-medium">{report.expenseCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Average Daily Spending:</span>
                <span className="font-medium">
                  {formatCurrency(report.totalExpenses / Math.max(1, Math.ceil((report.endDate.getTime() - report.startDate.getTime()) / (1000 * 60 * 60 * 24))))}
                </span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">Expenses by JAR</h4>
            <div className="space-y-2 text-sm">
              {Object.entries(report.expensesByJar).map(([jarId, amount]) => (
                <div key={jarId} className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400 capitalize">{jarId}:</span>
                  <span className="font-medium">{formatCurrency(amount)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="jar-card">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Recent Transactions
        </h3>
        
        {transactions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">
              No transactions yet. Start adding income and expenses to see reports.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    JAR
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {transactions
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .slice(0, 10)
                  .map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {new Date(transaction.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          transaction.type === 'income' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}>
                          {transaction.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                        {transaction.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 capitalize">
                        {transaction.jarId || '-'}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium text-right ${
                        transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
