import { useEffect } from 'react';
import MainLayout from '../components/layout/MainLayout';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchExpenses } from '../store/slices/expenseSlice';
import type { RootState } from '../store/store';
import type { Expense } from '../store/slices/expenseSlice';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';

const COLORS = ['#3B82F6', '#10B981', '#EF4444', '#F59E0B', '#8B5CF6', '#EC4899'];
const MONTHLY_BUDGET = 2000;

const Analytics = () => {
  const dispatch = useAppDispatch();
  const { expenses, loading } = useAppSelector(
    (state: RootState) => state.expenses
  );

  useEffect(() => {
    dispatch(fetchExpenses());
  }, [dispatch]);

  // ── Current month expenses ──────────────────────────────
  const now = new Date();
  const currentMonthExpenses = expenses.filter((exp: Expense) => {
    const expDate = new Date(exp.date);
    return (
      expDate.getMonth() === now.getMonth() &&
      expDate.getFullYear() === now.getFullYear()
    );
  });

  // ── Summary Stats ───────────────────────────────────────
  const totalExpenses = currentMonthExpenses.reduce(
    (sum: number, exp: Expense) => sum + exp.amount, 0
  );

  const avgDaily = totalExpenses / now.getDate();

  const largestExpense = currentMonthExpenses.reduce(
    (max: Expense | null, exp: Expense) =>
      !max || exp.amount > max.amount ? exp : max,
    null
  );

  // ── Last month expenses for comparison ─────────────────
  const lastMonthExpenses = expenses.filter((exp: Expense) => {
    const expDate = new Date(exp.date);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1);
    return (
      expDate.getMonth() === lastMonth.getMonth() &&
      expDate.getFullYear() === lastMonth.getFullYear()
    );
  });

  const lastMonthTotal = lastMonthExpenses.reduce(
    (sum: number, exp: Expense) => sum + exp.amount, 0
  );

  const percentChange = lastMonthTotal > 0
    ? ((totalExpenses - lastMonthTotal) / lastMonthTotal) * 100
    : 0;

  // ── Daily spending for last 7 days ──────────────────────
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
    const dateStr = date.toISOString().split('T')[0];

    const amount = expenses
      .filter((exp: Expense) => exp.date === dateStr)
      .reduce((sum: number, exp: Expense) => sum + exp.amount, 0);

    return { day: dayName, amount: parseFloat(amount.toFixed(2)) };
  });

  // ── Category breakdown ──────────────────────────────────
  const categoryTotals = currentMonthExpenses.reduce(
    (acc: Record<string, number>, exp: Expense) => {
      acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
      return acc;
    }, {}
  );

  const categoryData = Object.entries(categoryTotals)
    .map(([name, value]) => ({
      name,
      value: parseFloat((value as number).toFixed(2))
    }))
    .sort((a, b) => b.value - a.value);

  // ── AI Predictions ──────────────────────────────────────
  const daysLeft = new Date(
    now.getFullYear(), now.getMonth() + 1, 0
  ).getDate() - now.getDate();

  const projectedTotal = totalExpenses + avgDaily * daysLeft;

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Loading analytics...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Analytics</h1>
          <p className="text-gray-600">Insights and trends about your spending</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-600 text-sm font-medium">Total This Month</h3>
            <p className="text-3xl font-bold text-gray-800 mt-2">
              ${totalExpenses.toFixed(2)}
            </p>
            <p className={`text-sm mt-1 ${percentChange > 0 ? 'text-red-600' : 'text-green-600'}`}>
              {percentChange > 0 ? '↑' : '↓'} {Math.abs(percentChange).toFixed(0)}% vs last month
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-600 text-sm font-medium">Average Daily</h3>
            <p className="text-3xl font-bold text-gray-800 mt-2">
              ${avgDaily.toFixed(2)}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Budget: ${(MONTHLY_BUDGET / 30).toFixed(2)}/day
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-600 text-sm font-medium">Largest Expense</h3>
            <p className="text-3xl font-bold text-gray-800 mt-2">
              ${largestExpense ? largestExpense.amount.toFixed(2) : '0.00'}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              {largestExpense ? largestExpense.description : 'No expenses yet'}
            </p>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Daily Spending Bar Chart */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Daily Spending (Last 7 Days)
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={last7Days}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip formatter={(value) => `$${value}`} />
                <Bar dataKey="amount" fill="#3B82F6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Category Pie Chart */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Spending by Category
            </h2>
            {categoryData.length === 0 ? (
              <div className="flex items-center justify-center h-64">
                <p className="text-gray-500">No data yet</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.name} ${Math.round((entry.percent ?? 0) * 100)}%`}
                    outerRadius={80}
                    dataKey="value"
                  >
                    {categoryData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `$${value}`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* AI Predictions */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            AI Predictions & Insights
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Budget Prediction */}
            {projectedTotal > MONTHLY_BUDGET ? (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                <div className="flex items-start">
                  <span className="text-2xl mr-3">🚨</span>
                  <div>
                    <h4 className="font-semibold text-red-800">Budget Overrun Alert</h4>
                    <p className="text-sm text-red-700 mt-1">
                      Projected to exceed budget by ${(projectedTotal - MONTHLY_BUDGET).toFixed(2)}
                    </p>
                    <p className="text-xs text-red-600 mt-2">
                      Reduce daily spending by ${((projectedTotal - MONTHLY_BUDGET) / daysLeft).toFixed(2)}/day
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
                    <p className="text-sm text-green-700 mt-1">
                      Projected to spend ${projectedTotal.toFixed(2)} this month
                    </p>
                    <p className="text-xs text-green-600 mt-2">
                      ${(MONTHLY_BUDGET - projectedTotal).toFixed(2)} under budget!
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Spending Pattern */}
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-lg">
              <div className="flex items-start">
                <span className="text-2xl mr-3">📊</span>
                <div>
                  <h4 className="font-semibold text-yellow-800">Spending Pattern</h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    Average daily spend: ${avgDaily.toFixed(2)}
                  </p>
                  <p className="text-xs text-yellow-600 mt-2">
                    Recommended max: ${(MONTHLY_BUDGET / 30).toFixed(2)}/day
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Category Breakdown Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">Category Breakdown</h2>
          </div>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">% of Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">vs Budget</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {categoryData.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    No expenses this month yet
                  </td>
                </tr>
              ) : (
                categoryData.map((cat, index) => (
                  <tr key={cat.name} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div
                          className="w-3 h-3 rounded-full mr-3"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        ></div>
                        <span className="text-sm font-medium text-gray-900">
                          {cat.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      ${cat.value.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {totalExpenses > 0
                        ? Math.round((cat.value / totalExpenses) * 100)
                        : 0}%
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={cat.value > MONTHLY_BUDGET / categoryData.length
                        ? 'text-red-600'
                        : 'text-green-600'
                      }>
                        {cat.value > MONTHLY_BUDGET / categoryData.length
                          ? '↑ High'
                          : '↓ Normal'
                        }
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </MainLayout>
  );
};

export default Analytics;