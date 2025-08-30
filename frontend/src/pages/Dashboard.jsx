import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/common/Header';
import { transactionAPI } from '../services/api';

const Dashboard = () => {
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [transactionsResponse, summaryResponse] = await Promise.all([
        transactionAPI.getAll({ limit: 5 }),
        transactionAPI.getSummary()
      ]);
      
      const transactionsData = transactionsResponse.transactions || [];
      // Sort by date in descending order (most recent first)
      const sortedTransactions = transactionsData.sort((a, b) => new Date(b.date) - new Date(a.date));
      setRecentTransactions(sortedTransactions);
      
      const analytics = summaryResponse.summary;
      if (analytics) {
        setSummary({
          totalIncome: analytics.totalIncome || 0,
          totalExpenses: analytics.totalExpense || 0,
          balance: analytics.balance || 0
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to FinanceAssistant! 👋
          </h1>
          <p className="text-gray-600">Manage your finances with ease</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Link to="/transactions?action=add" className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow flex flex-col items-center">
            <div className="text-2xl mb-2">➕</div>
            <h3 className="font-semibold">Add Transaction</h3>
          </Link>
          <Link to="/receipts" className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow flex flex-col items-center">
            <div className="text-2xl mb-2">📷</div>
            <h3 className="font-semibold">Upload Receipt</h3>
          </Link>
          <Link to="/analysis" className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow flex flex-col items-center">
            <div className="text-2xl mb-2">📊</div>
            <h3 className="font-semibold">View Analytics</h3>
          </Link>
          <Link to="/transactions" className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow flex flex-col items-center">
            <div className="text-2xl mb-2">📋</div>
            <h3 className="font-semibold">All Transactions</h3>
          </Link>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Income</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(summary.totalIncome)}
                </p>
              </div>
              <div className="text-2xl">💰</div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Expenses</p>
                <p className="text-2xl font-bold text-gray-600">
                  {formatCurrency(summary.totalExpenses)}
                </p>
              </div>
              <div className="text-2xl">💸</div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Net Balance</p>
                <p className={`text-2xl font-bold ${summary.balance >= 0 ? 'text-green-600' : 'text-gray-600'}`}>
                  {formatCurrency(summary.balance)}
                </p>
              </div>
              <div className="text-2xl">⚖️</div>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Recent Transactions</h2>
              <Link to="/transactions" className="text-gray-600 hover:text-gray-700 font-medium text-sm">
                View all →
              </Link>
            </div>
          </div>
          <div className="p-6">
            {recentTransactions.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">📝</div>
                <h3 className="text-lg font-medium mb-2">No transactions yet</h3>
                <Link to="/transactions?action=add" className="inline-flex px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
                  Add Transaction
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {recentTransactions.map((transaction) => (
                  <div key={transaction._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="text-lg">
                        {transaction.type === 'income' ? '💰' : '💸'}
                      </div>
                      <div>
                        <p className="font-medium">{transaction.description || 'No description'}</p>
                        <p className="text-sm text-gray-600">{transaction.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${transaction.type === 'income' ? 'text-green-600' : 'text-gray-600'}`}>
                        {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(transaction.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
