const aiFinancialService = require('../services/aiFinancialService');

// Get AI-powered financial insights
const getFinancialInsights = async (req, res) => {
  try {
    console.log('🤖 Generating financial insights for user:', req.userId);
    
    const { period = '30d' } = req.query;
    
    // Get user analytics
    const analytics = await aiFinancialService.getUserAnalytics(req.userId, period);
    
    if (analytics.transactions.length === 0) {
      return res.json({
        data: `
## 👋 Welcome to AI Financial Insights!

### Getting Started
You don't have any transactions yet. To get personalized AI insights:

1. **Add your first transaction** - Record income or expenses
2. **Upload receipts** - Use our AI-powered OCR to automatically extract transaction data
3. **Categorize expenses** - Help our AI understand your spending patterns

### What You'll Get
Once you have transaction data, I'll provide:
- 📊 **Spending pattern analysis**
- 💡 **Personalized financial advice** 
- 🎯 **Budget optimization tips**
- 📈 **Savings recommendations**

Start by adding a few transactions to see the magic happen! ✨
        `,
        analytics: null
      });
    }

    // Generate AI insights
    const insights = await aiFinancialService.generateFinancialInsights(
      analytics.transactions, 
      analytics
    );

    res.json({
      data: insights,
      analytics: {
        totalTransactions: analytics.transactionCount,
        period,
        dataCompleteness: analytics.dataCompleteness,
        lastUpdated: new Date()
      }
    });

  } catch (error) {
    console.error('❌ Error generating financial insights:', error);
    res.status(500).json({ 
      message: 'Failed to generate financial insights',
      error: error.message 
    });
  }
};

// Get personalized financial advice
const getFinancialAdvice = async (req, res) => {
  try {
    console.log('💡 Generating financial advice for user:', req.userId);
    
    const { period = '30d' } = req.query;
    
    // Get user analytics
    const analytics = await aiFinancialService.getUserAnalytics(req.userId, period);
    
    if (analytics.transactions.length === 0) {
      return res.json({
        data: `
## 💰 Personal Financial Advisor

### Start Your Financial Journey
To receive personalized advice, I need to understand your financial patterns:

1. **Record your income** - Add salary, freelance, or other income sources
2. **Track daily expenses** - Food, transportation, entertainment, etc.
3. **Upload receipts** - Let AI automatically categorize your spending

### Financial Tips to Get Started
- 📱 **Use the receipt scanner** for quick expense tracking
- 🎯 **Set spending categories** to understand where your money goes  
- 💡 **Track for a week** to get your first personalized insights
- 📊 **Review patterns** to identify optimization opportunities

Ready to take control of your finances? Add your first transaction now! 🚀
        `,
        analytics: null
      });
    }

    // Generate AI advice
    const advice = await aiFinancialService.generateFinancialAdvice(
      analytics.transactions, 
      analytics
    );

    res.json({
      data: advice,
      analytics: {
        totalTransactions: analytics.transactionCount,
        expenseToIncomeRatio: analytics.expenseToIncomeRatio,
        savingsRate: analytics.totalIncome > 0 ? (analytics.totalIncome - analytics.totalExpenses) / analytics.totalIncome : 0,
        period,
        lastUpdated: new Date()
      }
    });

  } catch (error) {
    console.error('❌ Error generating financial advice:', error);
    res.status(500).json({ 
      message: 'Failed to generate financial advice',
      error: error.message 
    });
  }
};

// Get category-based analysis
const getCategoryAnalysis = async (req, res) => {
  try {
    console.log('📊 Generating category analysis for user:', req.userId);
    
    const { period = '30d' } = req.query;
    const analytics = await aiFinancialService.getUserAnalytics(req.userId, period);

    if (analytics.transactions.length === 0) {
      return res.json({
        categoryBreakdown: [],
        topCategories: [],
        insights: 'No transaction data available for category analysis'
      });
    }

    // Generate category insights
    let categoryInsights = '';
    if (analytics.topCategories.length > 0) {
      const topCat = analytics.topCategories[0];
      categoryInsights = `Your highest spending category is **${topCat.name}** at ₹${topCat.amount} (${(topCat.percentage * 100).toFixed(1)}% of expenses).`;
      
      if (topCat.percentage > 0.4) {
        categoryInsights += ' This category dominates your expenses - consider if this aligns with your priorities.';
      } else if (analytics.categoryBreakdown.length > 5) {
        categoryInsights += ' Your expenses are well-distributed across categories, showing balanced spending habits.';
      }
    }

    res.json({
      categoryBreakdown: analytics.categoryBreakdown,
      topCategories: analytics.topCategories,
      totalExpenses: analytics.totalExpenses,
      insights: categoryInsights,
      period,
      lastUpdated: new Date()
    });

  } catch (error) {
    console.error('❌ Error generating category analysis:', error);
    res.status(500).json({ 
      message: 'Failed to generate category analysis',
      error: error.message 
    });
  }
};

// Get spending patterns analysis
const getSpendingPatterns = async (req, res) => {
  try {
    console.log('📈 Analyzing spending patterns for user:', req.userId);
    
    const { period = '30d' } = req.query;
    const analytics = await aiFinancialService.getUserAnalytics(req.userId, period);

    if (analytics.transactions.length === 0) {
      return res.json({
        weeklyPattern: [],
        monthlyTrend: [],
        heatmapData: [],
        insights: 'No transaction data available for pattern analysis'
      });
    }

    // Generate pattern analysis
    const patternInsights = await aiFinancialService.analyzeSpendingPatterns(analytics.transactions);

    res.json({
      weeklyPattern: analytics.weeklyPattern,
      monthlyTrend: analytics.monthlyTrend,
      heatmapData: analytics.heatmapData,
      averageDailySpending: analytics.averageDailySpending,
      maxDailySpending: Math.max(...analytics.heatmapData.map(d => d.amount)),
      insights: patternInsights,
      period,
      lastUpdated: new Date()
    });

  } catch (error) {
    console.error('❌ Error analyzing spending patterns:', error);
    res.status(500).json({ 
      message: 'Failed to analyze spending patterns',
      error: error.message 
    });
  }
};

// Get comprehensive analytics with AI insights
const getDetailedAnalytics = async (req, res) => {
  try {
    console.log('🔍 Generating detailed analytics for user:', req.userId);
    
    const { period = '30d' } = req.query;
    const analytics = await aiFinancialService.getUserAnalytics(req.userId, period);

    if (analytics.transactions.length === 0) {
      return res.json({
        message: 'No transaction data available',
        analytics: null,
        recommendations: [
          'Start by adding your income and expense transactions',
          'Use the receipt scanner to quickly add expenses',
          'Categorize your transactions for better insights',
          'Track expenses for at least a week to see patterns'
        ]
      });
    }

    // Generate comprehensive recommendations
    const recommendations = [];
    
    // Expense ratio recommendations
    if (analytics.expenseToIncomeRatio > 0.8) {
      recommendations.push('Your expenses are high relative to income. Consider reducing discretionary spending.');
    } else if (analytics.expenseToIncomeRatio < 0.5) {
      recommendations.push('Excellent expense control! Consider increasing your investment contributions.');
    }

    // Category recommendations
    if (analytics.topCategories.length > 0) {
      const topCat = analytics.topCategories[0];
      if (topCat.percentage > 0.4) {
        recommendations.push(`Consider reducing ${topCat.name} expenses, which make up ${(topCat.percentage * 100).toFixed(1)}% of your budget.`);
      }
    }

    // Savings recommendations
    const savingsRate = analytics.totalIncome > 0 ? (analytics.totalIncome - analytics.totalExpenses) / analytics.totalIncome : 0;
    if (savingsRate < 0.2) {
      recommendations.push('Aim to save at least 20% of your income for long-term financial security.');
    }

    // Transaction frequency
    if (analytics.transactionCount < 10) {
      recommendations.push('Track more transactions to get better insights and recommendations.');
    }

    res.json({
      data: analytics,
      summary: {
        totalIncome: analytics.totalIncome,
        totalExpenses: analytics.totalExpenses,
        balance: analytics.balance,
        expenseToIncomeRatio: analytics.expenseToIncomeRatio,
        savingsRate,
        transactionCount: analytics.transactionCount,
        daysAnalyzed: analytics.daysAnalyzed
      },
      categoryBreakdown: analytics.categoryBreakdown,
      topCategories: analytics.topCategories,
      weeklyPattern: analytics.weeklyPattern,
      monthlyTrend: analytics.monthlyTrend,
      heatmapData: analytics.heatmapData,
      averageDailySpending: analytics.averageDailySpending,
      largestTransaction: analytics.largestTransaction,
      recommendations,
      period,
      lastUpdated: new Date()
    });

  } catch (error) {
    console.error('❌ Error generating detailed analytics:', error);
    res.status(500).json({ 
      message: 'Failed to generate detailed analytics',
      error: error.message 
    });
  }
};

module.exports = {
  getFinancialInsights,
  getFinancialAdvice,
  getCategoryAnalysis,
  getSpendingPatterns,
  getDetailedAnalytics
};
