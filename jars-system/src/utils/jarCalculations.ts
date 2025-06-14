import { type JarAllocations,type Jar, JAR_COLORS } from '../types';

export const getJarInfo = (language: 'en' | 'vi' = 'en'): Jar[] => {
  const jars: Jar[] = [
    {
      id: 'necessities',
      name: 'Necessities',
      nameVi: 'Chi phí thiết yếu',
      description: 'Essential living expenses like rent, food, utilities',
      descriptionVi: 'Chi phí sinh hoạt thiết yếu như tiền nhà, thức ăn, điện nước',
      color: JAR_COLORS.necessities,
      icon: '🏠',
      defaultPercentage: 55,
      currentBalance: 0,
      allocated: 0,
      spent: 0,
    },
    {
      id: 'education',
      name: 'Education',
      nameVi: 'Giáo dục',
      description: 'Learning, courses, books, skill development',
      descriptionVi: 'Học tập, khóa học, sách vở, phát triển kỹ năng',
      color: JAR_COLORS.education,
      icon: '📚',
      defaultPercentage: 10,
      currentBalance: 0,
      allocated: 0,
      spent: 0,
    },
    {
      id: 'longterm',
      name: 'Long-term Savings',
      nameVi: 'Tiết kiệm dài hạn',
      description: 'Emergency fund, retirement, major purchases',
      descriptionVi: 'Quỹ khẩn cấp, hưu trí, mua sắm lớn',
      color: JAR_COLORS.longterm,
      icon: '🏦',
      defaultPercentage: 10,
      currentBalance: 0,
      allocated: 0,
      spent: 0,
    },
    {
      id: 'play',
      name: 'Play',
      nameVi: 'Giải trí',
      description: 'Entertainment, hobbies, fun activities',
      descriptionVi: 'Giải trí, sở thích, hoạt động vui chơi',
      color: JAR_COLORS.play,
      icon: '🎮',
      defaultPercentage: 10,
      currentBalance: 0,
      allocated: 0,
      spent: 0,
    },
    {
      id: 'financial',
      name: 'Financial Freedom',
      nameVi: 'Tự do tài chính',
      description: 'Investments, passive income, wealth building',
      descriptionVi: 'Đầu tư, thu nhập thụ động, xây dựng tài sản',
      color: JAR_COLORS.financial,
      icon: '💰',
      defaultPercentage: 10,
      currentBalance: 0,
      allocated: 0,
      spent: 0,
    },
    {
      id: 'give',
      name: 'Give',
      nameVi: 'Cho đi',
      description: 'Charity, gifts, helping others',
      descriptionVi: 'Từ thiện, quà tặng, giúp đỡ người khác',
      color: JAR_COLORS.give,
      icon: '❤️',
      defaultPercentage: 5,
      currentBalance: 0,
      allocated: 0,
      spent: 0,
    },
  ];

  return jars;
};

export const calculateJarAllocations = (
  totalIncome: number,
  allocations: JarAllocations
): Record<keyof JarAllocations, number> => {
  return {
    necessities: (totalIncome * allocations.necessities) / 100,
    education: (totalIncome * allocations.education) / 100,
    longterm: (totalIncome * allocations.longterm) / 100,
    play: (totalIncome * allocations.play) / 100,
    financial: (totalIncome * allocations.financial) / 100,
    give: (totalIncome * allocations.give) / 100,
  };
};

export const validateJarAllocations = (allocations: JarAllocations): boolean => {
  const total = Object.values(allocations).reduce((sum, value) => sum + value, 0);
  return Math.abs(total - 100) < 0.01; // Allow for small floating point errors
};

export const formatCurrency = (
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

export const formatPercentage = (value: number, decimals: number = 1): string => {
  return `${value.toFixed(decimals)}%`;
};

export const getJarProgress = (allocated: number, spent: number): number => {
  if (allocated === 0) return 0;
  return Math.min((spent / allocated) * 100, 100);
};

export const getJarStatus = (allocated: number, spent: number): 'safe' | 'warning' | 'danger' => {
  const progress = getJarProgress(allocated, spent);
  
  if (progress <= 70) return 'safe';
  if (progress <= 90) return 'warning';
  return 'danger';
};

export const calculateSavingsRate = (totalIncome: number, totalExpenses: number): number => {
  if (totalIncome === 0) return 0;
  return ((totalIncome - totalExpenses) / totalIncome) * 100;
};

export const getMonthlyData = (
  transactions: Array<{ date: Date; amount: number }>,
  months: number = 6
): Array<{ month: string; amount: number }> => {
  const now = new Date();
  const monthlyData: Array<{ month: string; amount: number }> = [];

  for (let i = months - 1; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthName = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    
    const monthlyAmount = transactions
      .filter(transaction => {
        const transactionDate = new Date(transaction.date);
        return (
          transactionDate.getMonth() === date.getMonth() &&
          transactionDate.getFullYear() === date.getFullYear()
        );
      })
      .reduce((sum, transaction) => sum + transaction.amount, 0);

    monthlyData.push({ month: monthName, amount: monthlyAmount });
  }

  return monthlyData;
};

export const exportToCSV = (data: any[], filename: string): void => {
  if (data.length === 0) return;

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        // Escape commas and quotes in CSV
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(',')
    )
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const generateFinancialReport = (
  incomes: Array<{ amount: number; date: Date; source: string }>,
  expenses: Array<{ amount: number; date: Date; jarId: keyof JarAllocations; description: string }>,
  period: 'month' | 'quarter' | 'year' = 'month'
): any => {
  const now = new Date();
  let startDate: Date;

  switch (period) {
    case 'month':
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    case 'quarter':
      const quarterStart = Math.floor(now.getMonth() / 3) * 3;
      startDate = new Date(now.getFullYear(), quarterStart, 1);
      break;
    case 'year':
      startDate = new Date(now.getFullYear(), 0, 1);
      break;
  }

  const filteredIncomes = incomes.filter(income => new Date(income.date) >= startDate);
  const filteredExpenses = expenses.filter(expense => new Date(expense.date) >= startDate);

  const totalIncome = filteredIncomes.reduce((sum, income) => sum + income.amount, 0);
  const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  const expensesByJar = filteredExpenses.reduce((acc, expense) => {
    acc[expense.jarId] = (acc[expense.jarId] || 0) + expense.amount;
    return acc;
  }, {} as Record<keyof JarAllocations, number>);

  return {
    period,
    startDate,
    endDate: now,
    totalIncome,
    totalExpenses,
    netSavings: totalIncome - totalExpenses,
    savingsRate: calculateSavingsRate(totalIncome, totalExpenses),
    expensesByJar,
    incomeCount: filteredIncomes.length,
    expenseCount: filteredExpenses.length,
  };
};
