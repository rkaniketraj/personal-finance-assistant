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
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-2 border-slate-200 border-t-slate-900 mx-auto"></div>
              <p className="mt-4 text-slate-600">Loading dashboard...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl font-light text-slate-900 mb-3 tracking-tight">
            Welcome back
          </h1>
          <p className="text-slate-600 text-lg">Here's an overview of your financial activity</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/60 backdrop-blur-sm p-8 rounded-2xl border border-white/20 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-slate-600 uppercase tracking-wider">Total Income</p>
            </div>
            <p className="text-3xl font-light text-emerald-600 tracking-tight">
              {formatCurrency(summary.totalIncome)}
            </p>
          </div>
          <div className="bg-white/60 backdrop-blur-sm p-8 rounded-2xl border border-white/20 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-slate-600 uppercase tracking-wider">Total Expenses</p>
            </div>
            <p className="text-3xl font-light text-slate-900 tracking-tight">
              {formatCurrency(summary.totalExpenses)}
            </p>
          </div>
          <div className="bg-white/60 backdrop-blur-sm p-8 rounded-2xl border border-white/20 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-slate-600 uppercase tracking-wider">Net Balance</p>
            </div>
            <p className={`text-3xl font-light tracking-tight ${summary.balance >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
              {formatCurrency(summary.balance)}
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          <Link to="/transactions?action=add" className="bg-slate-100 text-slate-900 p-6 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 group border border-slate-200">
            <div className="text-center">
              <div className="w-3 h-3 bg-slate-400 rounded-full mx-auto mb-3 group-hover:bg-slate-500 transition-colors"></div>
              <h3 className="font-semibold text-sm tracking-tight">Add Transaction</h3>
              <p className="text-xs text-slate-600 mt-1">Record income or expense</p>
            </div>
          </Link>
          <Link to="/receipts" className="bg-slate-50 text-slate-900 p-6 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 group border border-slate-200">
            <div className="text-center">
              <div className="w-3 h-3 bg-slate-400 rounded-full mx-auto mb-3 group-hover:bg-slate-500 transition-colors"></div>
              <h3 className="font-semibold text-sm tracking-tight">Upload Receipt</h3>
              <p className="text-xs text-slate-600 mt-1">Extract data with OCR</p>
            </div>
          </Link>
          <Link to="/analysis" className="bg-white text-slate-900 p-6 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 group border border-slate-200">
            <div className="text-center">
              <div className="w-3 h-3 bg-slate-400 rounded-full mx-auto mb-3 group-hover:bg-slate-500 transition-colors"></div>
              <h3 className="font-semibold text-sm tracking-tight">View Analytics</h3>
              <p className="text-xs text-slate-600 mt-1">Charts and insights</p>
            </div>
          </Link>
          <Link to="/transactions" className="bg-gray-50 text-slate-900 p-6 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 group border border-slate-200">
            <div className="text-center">
              <div className="w-3 h-3 bg-slate-400 rounded-full mx-auto mb-3 group-hover:bg-slate-500 transition-colors"></div>
              <h3 className="font-semibold text-sm tracking-tight">All Transactions</h3>
              <p className="text-xs text-slate-600 mt-1">View complete history</p>
            </div>
          </Link>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 shadow-sm">
          <div className="px-8 py-6 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-900 tracking-tight">Recent Transactions</h2>
              <Link to="/transactions" className="text-slate-600 hover:text-slate-900 font-medium text-sm transition-colors">
                View all →
              </Link>
            </div>
          </div>
          <div className="p-8">
            {recentTransactions.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-lg font-semibold text-slate-900 mb-2 tracking-tight">No transactions yet</h3>
                <p className="text-slate-600 mb-6">Start by adding your first transaction</p>
                <Link to="/transactions?action=add" className="inline-flex px-6 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 font-medium transition-colors">
                  Add Transaction
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {recentTransactions.map((transaction) => (
                  <div key={transaction._id} className="flex items-center justify-between p-6 bg-slate-50/50 rounded-xl border border-slate-100/50 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div>
                        <p className="font-semibold text-slate-900 tracking-tight">{transaction.description || 'No description'}</p>
                        <p className="text-sm text-slate-600">{transaction.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold tracking-tight ${
                        transaction.type === 'income' ? 'text-emerald-600' : 'text-slate-900'
                      }`}>
                        {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
                      </p>
                      <p className="text-sm text-slate-500">
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
