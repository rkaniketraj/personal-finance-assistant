const Transaction = require('../models/Transaction');

// Create new transaction
const createTransaction = async (req, res) => {
  try {
    const { type, amount, category, description, date } = req.body;

    const transaction = new Transaction({
      userId: req.userId,
      type,
      amount,
      category,
      description,
      date: date || new Date()
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
    const { limit } = req.query;
    let query = Transaction.find({ userId: req.userId }).sort({ createdAt: -1 });
    
    if (limit) {
      query = query.limit(parseInt(limit));
    }
    
    const transactions = await query;
    res.json({ transactions });
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
    const transactions = await Transaction.find({ userId: req.userId });
    
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
        balance: income - expense
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