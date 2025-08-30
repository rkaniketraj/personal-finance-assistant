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

// Get all transactions for user
const getTransactions = async (req, res) => {
  try {
    const { limit, startDate, endDate, type, category } = req.query;
    
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
    
    let query = Transaction.find(filter).sort({ createdAt: -1 });
    
    if (limit) {
      query = query.limit(parseInt(limit));
    }
    
    const transactions = await query;
    
    res.json({ 
      transactions,
      filter: {
        startDate: startDate || null,
        endDate: endDate || null,
        type: type || null,
        category: category || null,
        total: transactions.length
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

module.exports = {
  createTransaction,
  getTransactions,
  getTransaction,
  updateTransaction,
  deleteTransaction,
  getSummary
};