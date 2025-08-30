const Transaction = require('../models/Transaction');

// Create new transaction
const createTransaction = async (req, res) => {
  try {
    const { type, amount, category, description, date, receiptId } = req.body;

    const transaction = new Transaction({
      userId: req.userId,
      type,
      amount,
      category,
      description,
      date: date || new Date(),
      receiptId: receiptId || null
    });

    await transaction.save();
    res.status(201).json({ message: 'Transaction created', transaction });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all transactions for user with pagination
const getTransactions = async (req, res) => {
  try {
    const { 
      limit = 10, 
      page = 1, 
      startDate, 
      endDate, 
      type, 
      category 
    } = req.query;
    
    // Parse pagination parameters
    const pageNumber = parseInt(page) || 1;
    const limitNumber = parseInt(limit) || 10;
    const skip = (pageNumber - 1) * limitNumber;
    
    // Build filter query
    let filter = { userId: req.userId };
    
    // Add date range filter if provided
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) {
        filter.date.$gte = new Date(startDate);
      }
      if (endDate) {
        // Add 23:59:59 to include the entire end date
        const endDateTime = new Date(endDate);
        endDateTime.setHours(23, 59, 59, 999);
        filter.date.$lte = endDateTime;
      }
    }
    
    // Add type filter if provided
    if (type && ['income', 'expense'].includes(type)) {
      filter.type = type;
    }
    
    // Add category filter if provided
    if (category) {
      filter.category = category;
    }
    
    // Get total count for pagination
    const totalTransactions = await Transaction.countDocuments(filter);
    
    // Get paginated transactions
    const transactions = await Transaction.find(filter)
      .sort({ date: -1, createdAt: -1 })
      .skip(skip)
      .limit(limitNumber);
    
    // Calculate pagination metadata
    const totalPages = Math.ceil(totalTransactions / limitNumber);
    const hasNextPage = pageNumber < totalPages;
    const hasPrevPage = pageNumber > 1;
    
    res.json({ 
      transactions,
      pagination: {
        currentPage: pageNumber,
        totalPages,
        totalTransactions,
        limit: limitNumber,
        hasNextPage,
        hasPrevPage,
        nextPage: hasNextPage ? pageNumber + 1 : null,
        prevPage: hasPrevPage ? pageNumber - 1 : null
      },
      filter: {
        startDate: startDate || null,
        endDate: endDate || null,
        type: type || null,
        category: category || null
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single transaction
const getTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      userId: req.userId
    });

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.json({ transaction });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update transaction
const updateTransaction = async (req, res) => {
  try {
    const { type, amount, category, description, date } = req.body;

    const transaction = await Transaction.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { type, amount, category, description, date },
      { new: true }
    );

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.json({ message: 'Transaction updated', transaction });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete transaction
const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId
    });

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.json({ message: 'Transaction deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get simple summary
const getSummary = async (req, res) => {
  try {
    const { startDate, endDate, type, category } = req.query;
    
    // Build filter query
    let filter = { userId: req.userId };
    
    // Add date range filter if provided
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) {
        filter.date.$gte = new Date(startDate);
      }
      if (endDate) {
        const endDateTime = new Date(endDate);
        endDateTime.setHours(23, 59, 59, 999);
        filter.date.$lte = endDateTime;
      }
    }
    
    // Add type filter if provided
    if (type && ['income', 'expense'].includes(type)) {
      filter.type = type;
    }
    
    // Add category filter if provided
    if (category) {
      filter.category = category;
    }
    
    const transactions = await Transaction.find(filter);
    
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expense = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    res.json({
      summary: {
        totalIncome: income,
        totalExpense: expense,
        balance: income - expense,
        transactionCount: transactions.length,
        filter: {
          startDate: startDate || null,
          endDate: endDate || null,
          type: type || null,
          category: category || null
        }
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get comprehensive analytics
const getAnalytics = async (req, res) => {
  try {
    const { period = '30d' } = req.query;
    
    // Calculate date range based on period
    const periodDays = {
      '7d': 7,
      '30d': 30,
      '90d': 90,
      '6m': 180,
      '1y': 365
    }[period] || 30;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - periodDays);
    
    // Build filter query
    let filter = { 
      userId: req.userId,
      date: { $gte: startDate }
    };
    
    const transactions = await Transaction.find(filter).sort({ date: -1 });
    
    // Basic calculations
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const balance = totalIncome - totalExpenses;

    // Category breakdown
    const categoryTotals = {};
    transactions.filter(t => t.type === 'expense').forEach(t => {
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
    });

    const categoryBreakdown = Object.entries(categoryTotals)
      .map(([name, amount]) => ({
        name,
        amount,
        percentage: totalExpenses > 0 ? amount / totalExpenses : 0
      }))
      .sort((a, b) => b.amount - a.amount);

    const topCategories = categoryBreakdown.slice(0, 5);

    // Monthly trend
    const monthlyData = {};
    transactions.forEach(transaction => {
      const monthKey = new Date(transaction.date).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short' 
      });
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { month: monthKey, income: 0, expenses: 0 };
      }
      
      if (transaction.type === 'income') {
        monthlyData[monthKey].income += transaction.amount;
      } else {
        monthlyData[monthKey].expenses += transaction.amount;
      }
    });

    const monthlyTrend = Object.values(monthlyData).slice(-6); // Last 6 months

    // Weekly pattern
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const weeklyPattern = daysOfWeek.map(day => ({ day, amount: 0, count: 0 }));

    transactions.filter(t => t.type === 'expense').forEach(transaction => {
      const dayIndex = new Date(transaction.date).getDay();
      weeklyPattern[dayIndex].amount += transaction.amount;
      weeklyPattern[dayIndex].count += 1;
    });

    // Heatmap data (last 30 days)
    const heatmapData = [];
    const today = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayExpenses = transactions
        .filter(t => t.type === 'expense' && t.date.toISOString().split('T')[0] === dateStr)
        .reduce((sum, t) => sum + t.amount, 0);
      
      heatmapData.push({
        date: date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
        amount: dayExpenses
      });
    }

    // Additional metrics
    const averageDailySpending = totalExpenses / periodDays;
    const largestTransaction = Math.max(...transactions.map(t => t.amount), 0);
    const expenseToIncomeRatio = totalIncome > 0 ? totalExpenses / totalIncome : 0;
    const maxDailySpending = Math.max(...heatmapData.map(d => d.amount), 0);

    // Generate recommendations
    const recommendations = [];
    
    if (expenseToIncomeRatio > 0.8) {
      recommendations.push('Consider reducing expenses - you\'re spending over 80% of your income');
    }
    
    if (topCategories.length > 0 && topCategories[0].percentage > 0.4) {
      recommendations.push(`Your ${topCategories[0].name} expenses are quite high - consider optimization`);
    }
    
    if (averageDailySpending > totalIncome / 30) {
      recommendations.push('Daily spending exceeds daily income - review your budget');
    }
    
    if (transactions.length < 10) {
      recommendations.push('Track more transactions to get better insights');
    }

    res.json({
      data: {
        summary: {
          totalIncome,
          totalExpense: totalExpenses, // Keep legacy naming for frontend compatibility
          totalExpenses, // New correct naming
          balance
        },
        totalIncome,
        totalExpenses,
        balance,
        categoryBreakdown,
        topCategories,
        monthlyTrend,
        weeklyPattern,
        heatmapData,
        averageDailySpending,
        largestTransaction,
        expenseToIncomeRatio,
        maxDailySpending,
        daysAnalyzed: periodDays,
        transactionCount: transactions.length,
        dataCompleteness: Math.min(1.0, transactions.length / (periodDays * 2)),
        recommendations,
        period,
        lastUpdated: new Date()
      }
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createTransaction,
  getTransactions,
  getTransaction,
  updateTransaction,
  deleteTransaction,
  getSummary,
  getAnalytics
};