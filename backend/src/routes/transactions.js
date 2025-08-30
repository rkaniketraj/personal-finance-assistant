const express = require('express');
const {
  createTransaction,
  getTransactions,
  getTransaction,
  updateTransaction,
  deleteTransaction,
  getSummary
} = require('../controllers/transactionController');
const { auth } = require('../middleware/auth');

const router = express.Router();

// All transaction routes require authentication
router.use(auth);

// Routes
router.post('/', createTransaction);
router.get('/', getTransactions);
router.get('/summary', getSummary);
router.get('/:id', getTransaction);
router.put('/:id', updateTransaction);
router.delete('/:id', deleteTransaction);

module.exports = router;