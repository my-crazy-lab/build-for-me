import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, PiggyBank } from 'lucide-react';
import { useJars } from '../../context/JarsContext';
import { useAuth } from '../../context/AuthContext';
import { getJarInfo, formatCurrency } from '../../utils/jarCalculations';

const Dashboard: React.FC = () => {
  const { dashboardStats } = useJars();
  const { user } = useAuth();

  const jars = getJarInfo(user?.preferences.language);

  // Prepare data for pie chart
  const pieData = jars.map(jar => ({
    name: jar.name,
    value: dashboardStats.jarBalances[jar.id],
    color: jar.color,
  })).filter(item => item.value > 0);

  // Prepare data for bar chart
  const barData = jars.map(jar => ({
    name: jar.name,
    allocated: (dashboardStats.totalIncome * (user?.preferences.jarAllocations[jar.id] || 0)) / 100,
    balance: dashboardStats.jarBalances[jar.id],
    color: jar.color,
  }));

  const stats = [
    {
      name: 'Total Income',
      value: formatCurrency(dashboardStats.totalIncome),
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      name: 'Total Expenses',
      value: formatCurrency(dashboardStats.totalExpenses),
      icon: TrendingDown,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
    {
      name: 'Current Balance',
      value: formatCurrency(dashboardStats.totalBalance),
      icon: DollarSign,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      name: 'Savings Rate',
      value: `${dashboardStats.savingsRate.toFixed(1)}%`,
      icon: PiggyBank,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Welcome back, {user?.name}! Here's your financial overview.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="jar-card">
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {stat.name}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Jar Distribution Pie Chart */}
        <div className="jar-card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Jar Distribution
          </h3>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
              <p>No data available. Add some income to see the distribution.</p>
            </div>
          )}
        </div>

        {/* Jar Balances Bar Chart */}
        <div className="jar-card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Allocated vs Available
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                angle={-45}
                textAnchor="end"
                height={80}
                fontSize={12}
              />
              <YAxis tickFormatter={(value) => `$${value}`} />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Legend />
              <Bar dataKey="allocated" fill="#e5e7eb" name="Allocated" />
              <Bar dataKey="balance" fill="#3b82f6" name="Available" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Jar Cards */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Your JARS
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jars.map((jar) => {
            const allocated = (dashboardStats.totalIncome * (user?.preferences.jarAllocations[jar.id] || 0)) / 100;
            const balance = dashboardStats.jarBalances[jar.id];
            const spent = allocated - balance;
            const percentage = allocated > 0 ? (spent / allocated) * 100 : 0;
            
            return (
              <div key={jar.id} className="jar-card">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">{jar.icon}</span>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {jar.name}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {user?.preferences.jarAllocations[jar.id]}% allocation
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Allocated:</span>
                    <span className="font-medium">{formatCurrency(allocated)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Spent:</span>
                    <span className="font-medium">{formatCurrency(spent)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-semibold">
                    <span className="text-gray-900 dark:text-white">Available:</span>
                    <span className={balance >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {formatCurrency(balance)}
                    </span>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min(percentage, 100)}%`,
                        backgroundColor: percentage > 90 ? '#ef4444' : percentage > 70 ? '#f59e0b' : jar.color,
                      }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {percentage.toFixed(1)}% used
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
