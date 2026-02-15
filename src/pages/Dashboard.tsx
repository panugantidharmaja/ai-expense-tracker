import { useState, useEffect } from 'react';
import MainLayout from '../components/layout/MainLayout';
import supabase from '../config/supabaseClient';

interface Expense {
  id: string;
  date: string;
  description: string;
  category: string;
  payment_method: string;
  amount: number;
}

const Dashboard = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const MONTHLY_BUDGET = 2000;

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      // Get current month expenses only
      const now = new Date();
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
        .toISOString()
        .split('T')[0];
      const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0)
        .toISOString()
        .split('T')[0];

      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .gte('date', firstDay)
        .lte('date', lastDay)
        .order('date', { ascending: false });

      if (error) throw error;
      setExpenses(data || []);
    } catch (err) {
      console.error('Error fetching expenses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  // Calculate stats
  const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const remaining = MONTHLY_BUDGET - totalSpent;
  const progressPercent = Math.min((totalSpent / MONTHLY_BUDGET) * 100, 100);

  // Progress bar color
  const getProgressColor = () => {
    if (progressPercent < 70) return 'bg-green-400';
    if (progressPercent < 90) return 'bg-yellow-400';
    return 'bg-red-400';
  };

  // Spending by category
  const categoryTotals = expenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
    return acc;
  }, {} as Record<string, number>);

  const categoryData = Object.entries(categoryTotals)
    .map(([name, amount]) => ({
      name,
      amount,
      percentage: Math.round((amount / totalSpent) * 100)
    }))
    .sort((a, b) => b.amount - a.amount);

  // Category colors
  const categoryColors: Record<string, string> = {
    Food: 'bg-blue-500',
    Transport: 'bg-green-500',
    Bills: 'bg-red-500',
    Shopping: 'bg-yellow-500',
    Entertainment: 'bg-purple-500',
    Healthcare: 'bg-pink-500',
    Education: 'bg-indigo-500',
    Other: 'bg-gray-500'
  };

  // Recent 5 transactions
  const recentExpenses = expenses.slice(0, 5);

  // AI Insights
  const avgDaily = totalSpent / new Date().getDate();
  const daysLeft = new Date(
    new Date().getFullYear(),
    new Date().getMonth() + 1,
    0
  ).getDate() - new Date().getDate();
  const projectedTotal = totalSpent + avgDaily * daysLeft;

  if (loading) {
    return (
      <MainLayout onExpenseAdded={fetchExpenses}>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Loading dashboard...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout onExpenseAdded={fetchExpenses}>
      <div>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600">Overview of your expenses this month</p>
        </div>

        {/* Budget Card */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white mb-8">
          <h3 className="text-lg font-medium mb-4">Monthly Budget</h3>
          <div className="flex justify-between items-end mb-4">
            <div>
              <p className="text-sm opacity-90">Total Spent</p>
              <p className="text-4xl font-bold">${totalSpent.toFixed(2)}</p>
            </div>
            <div className="text-right">
              <p className="text-sm opacity-90">Budget</p>
              <p className="text-2xl font-semibold">${MONTHLY_BUDGET.toFixed(2)}</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="bg-white bg-opacity-20 rounded-full h-3 mb-2">
            <div
              className={`${getProgressColor()} rounded-full h-3 transition-all duration-500`}
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
          <p className="text-sm opacity-90">
            ${remaining.toFixed(2)} remaining ({progressPercent.toFixed(0)}% used)
          </p>
        </div>

        {/* AI Insights */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">AI Insights</h2>
          <div className="grid grid-cols-1 gap-4">
            {/* Prediction */}
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-lg">
              <div className="flex items-start">
                <span className="text-2xl mr-3">📊</span>
                <div>
                  <h4 className="font-semibold text-yellow-800">Prediction</h4>
                  <p className="text-sm text-yellow-700">
                    At current pace, you'll spend ${projectedTotal.toFixed(2)} this month
                  </p>
                </div>
              </div>
            </div>

            {/* Budget Warning */}
            {projectedTotal > MONTHLY_BUDGET ? (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                <div className="flex items-start">
                  <span className="text-2xl mr-3">⚠️</span>
                  <div>
                    <h4 className="font-semibold text-red-800">Warning</h4>
                    <p className="text-sm text-red-700">
                      You may exceed budget by ${(projectedTotal - MONTHLY_BUDGET).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg">
                <div className="flex items-start">
                  <span className="text-2xl mr-3">✅</span>
                  <div>
                    <h4 className="font-semibold text-green-800">On Track</h4>
                    <p className="text-sm text-green-700">
                      You're within budget! Keep it up.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Top Category */}
            {categoryData.length > 0 && (
              <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-lg">
                <div className="flex items-start">
                  <span className="text-2xl mr-3">🔍</span>
                  <div>
                    <h4 className="font-semibold text-purple-800">Top Spending</h4>
                    <p className="text-sm text-purple-700">
                      Most spent on {categoryData[0]?.name} (${categoryData[0]?.amount.toFixed(2)})
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Recommendation */}
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
              <div className="flex items-start">
                <span className="text-2xl mr-3">💡</span>
                <div>
                  <h4 className="font-semibold text-blue-800">Recommendation</h4>
                  <p className="text-sm text-blue-700">
                    Average daily spend: ${avgDaily.toFixed(2)}.
                    Try to keep it under ${(MONTHLY_BUDGET / 30).toFixed(2)}/day
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Spending by Category */}
        {categoryData.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Spending by Category</h2>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="space-y-4">
                {categoryData.map((cat) => (
                  <div key={cat.name}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">{cat.name}</span>
                      <span className="text-sm font-medium text-gray-700">
                        ${cat.amount.toFixed(2)} ({cat.percentage}%)
                      </span>
                    </div>
                    <div className="bg-gray-200 rounded-full h-2">
                      <div
                        className={`${categoryColors[cat.name] || 'bg-gray-500'} rounded-full h-2`}
                        style={{ width: `${cat.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Recent Transactions */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Recent Transactions</h2>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {recentExpenses.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-gray-500">No expenses yet. Click + to add your first expense!</p>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentExpenses.map((expense) => (
                    <tr key={expense.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {expense.description}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                          {expense.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(expense.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {expense.payment_method}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                        ${expense.amount.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;