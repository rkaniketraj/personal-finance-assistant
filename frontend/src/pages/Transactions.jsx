import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../components/common/Header';
import { transactionAPI } from '../services/api';
import Modal from '../components/common/Modal';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Chip,
  IconButton,
  Typography,
  Box
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const Transactions = () => {
  const [searchParams] = useSearchParams();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    type: '',
    category: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [formData, setFormData] = useState({
    type: 'expense',
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const columns = [
    { id: 'date', label: 'Date', minWidth: 100 },
    { id: 'description', label: 'Description', minWidth: 170 },
    { id: 'category', label: 'Category', minWidth: 100 },
    { id: 'type', label: 'Type', minWidth: 80, align: 'center' },
    { id: 'amount', label: 'Amount', minWidth: 100, align: 'right' },
    { id: 'actions', label: 'Actions', minWidth: 80, align: 'center' },
  ];

  const categories = {
    expense: ['Food & Dining', 'Transportation', 'Shopping', 'Entertainment', 'Others'],
    income: ['Salary', 'Business', 'Investment', 'Others']
  };

  const fetchTransactions = useCallback(async (filterParams = {}) => {
    try {
      setError(null);
      console.log('Fetching transactions with params:', { ...filters, ...filterParams });
      const params = { ...filters, ...filterParams };
      // Remove empty values
      const cleanParams = Object.fromEntries(
        Object.entries(params).filter(([, value]) => value !== '' && value !== null)
      );
      
      console.log('Clean params:', cleanParams);
      const response = await transactionAPI.getAll(cleanParams);
      console.log('API response:', response);
      const transactionsData = response.transactions || [];
      console.log('Transactions data:', transactionsData);
      // Sort by date in descending order (most recent first)
      const sortedTransactions = transactionsData.sort((a, b) => new Date(b.date) - new Date(a.date));
      setTransactions(sortedTransactions);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setError(error.message || 'Failed to fetch transactions');
      // Set an empty array so the component can render
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

    useEffect(() => {
    fetchTransactions();
    
    // Check if we should open add modal
    if (searchParams.get('action') === 'add') {
      setShowAddModal(true);
    }
  }, [searchParams, fetchTransactions]);

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const applyFilters = () => {
    setLoading(true);
    fetchTransactions();
  };

  const clearFilters = () => {
    setFilters({
      startDate: '',
      endDate: '',
      type: '',
      category: ''
    });
    setLoading(true);
    fetchTransactions({
      startDate: '',
      endDate: '',
      type: '',
      category: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await transactionAPI.create(formData);
      setShowAddModal(false);
      setFormData({
        type: 'expense',
        amount: '',
        category: '',
        description: '',
        date: new Date().toISOString().split('T')[0]
      });
      fetchTransactions();
    } catch (error) {
      console.error('Error creating transaction:', error);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this transaction?')) {
      try {
        await transactionAPI.delete(id);
        fetchTransactions();
      } catch (error) {
        console.error('Error deleting transaction:', error);
      }
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const createData = (transaction) => ({
    id: transaction._id,
    date: new Date(transaction.date).toLocaleDateString(),
    description: transaction.description || 'No description',
    category: transaction.category,
    type: transaction.type,
    amount: transaction.amount,
    transaction: transaction
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading transactions...</p>
          </div>
        </div>
      </div>
    );
  }

  console.log('Transactions state:', transactions);
  console.log('Loading state:', loading);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 flex items-center space-x-2"
            >
              <span>🔍</span>
              <span>Filters</span>
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
            >
              Add Transaction
            </button>
          </div>
        </div>

        {/* Filter Section */}
        {showFilters && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => handleFilterChange('startDate', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-gray-500 focus:border-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                <input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => handleFilterChange('endDate', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-gray-500 focus:border-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <select
                  value={filters.type}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-gray-500 focus:border-gray-500"
                >
                  <option value="">All Types</option>
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-gray-500 focus:border-gray-500"
                >
                  <option value="">All Categories</option>
                  {filters.type === 'income' ? (
                    categories.income.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))
                  ) : filters.type === 'expense' ? (
                    categories.expense.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))
                  ) : (
                    [...categories.income, ...categories.expense].map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))
                  )}
                </select>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                {transactions.length} transaction{transactions.length !== 1 ? 's' : ''} found
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Clear Filters
                </button>
                <button
                  onClick={applyFilters}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: 2, boxShadow: 1 }}>
          {transactions.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 12 }}>
              <Typography variant="h1" sx={{ fontSize: '4rem', mb: 2 }}>📝</Typography>
              <Typography variant="h6" sx={{ mb: 2 }}>No transactions yet</Typography>
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
              >
                Add Your First Transaction
              </button>
            </Box>
          ) : (
            <>
              <TableContainer sx={{ maxHeight: 500 }}>
                <Table stickyHeader aria-label="transactions table">
                  <TableHead>
                    <TableRow>
                      {columns.map((column) => (
                        <TableCell
                          key={column.id}
                          align={column.align}
                          style={{ minWidth: column.minWidth, fontWeight: 'bold' }}
                        >
                          {column.label}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {transactions
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((transaction) => {
                        const row = createData(transaction);
                        return (
                          <TableRow hover role="checkbox" tabIndex={-1} key={row.id} sx={{ height: '40px' }}>
                            <TableCell sx={{ padding: '4px 16px' }}>{row.date}</TableCell>
                            <TableCell sx={{ padding: '4px 16px' }}>{row.description}</TableCell>
                            <TableCell sx={{ padding: '4px 16px' }}>{row.category}</TableCell>
                            <TableCell align="center" sx={{ padding: '4px 16px' }}>
                              <Chip
                                label={row.type}
                                color={row.type === 'income' ? 'success' : 'error'}
                                size="small"
                                variant="outlined"
                              />
                            </TableCell>
                            <TableCell 
                              align="right" 
                              sx={{ 
                                color: row.type === 'income' ? 'success.main' : 'error.main',
                                fontWeight: 'bold',
                                padding: '4px 16px'
                              }}
                            >
                              {row.type === 'income' ? '+' : '-'} {formatCurrency(row.amount)}
                            </TableCell>
                            <TableCell align="center" sx={{ padding: '4px 16px' }}>
                              <IconButton
                                onClick={() => handleDelete(row.id)}
                                color="error"
                                size="small"
                              >
                                <DeleteIcon />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, 50]}
                component="div"
                count={transactions.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </>
          )}
        </Paper>
      </div>

      {/* Add Transaction Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add Transaction">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value, category: ''})}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Amount</label>
            <input
              type="number"
              required
              value={formData.amount}
              onChange={(e) => setFormData({...formData, amount: e.target.value})}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 p-2"
              placeholder="Enter amount"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select
              required
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
            >
              <option value="">Select a category</option>
              {categories[formData.type].map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 p-2"
              placeholder="Enter description (optional)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              required
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700"
            >
              Add Transaction
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Transactions;
