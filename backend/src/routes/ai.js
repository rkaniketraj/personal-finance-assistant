const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const {
  getFinancialInsights,
  getFinancialAdvice,
  getCategoryAnalysis,
  getSpendingPatterns,
  getDetailedAnalytics
} = require('../controllers/aiController');

// All routes require authentication
router.use(auth);

// Get AI-powered financial insights
router.get('/insights', getFinancialInsights);

// Get personalized financial advice
router.get('/advice', getFinancialAdvice);

// Get category-based analysis
router.get('/category-analysis', getCategoryAnalysis);

// Get spending patterns analysis
router.get('/spending-patterns', getSpendingPatterns);

// Get detailed analytics with AI insights
router.get('/detailed-analytics', getDetailedAnalytics);

module.exports = router;
