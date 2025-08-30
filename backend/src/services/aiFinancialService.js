const { GoogleGenerativeAI } = require('@google/generative-ai');
const Transaction = require('../models/Transaction');

class AIFinancialService {
  constructor() {
    // Initialize Gemini AI
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('⚠️ GEMINI_API_KEY not found in environment variables. AI insights will be limited.');
      this.genAI = null;
    } else {
      this.genAI = new GoogleGenerativeAI(apiKey);
    }
  }

  // Get financial insights using Gemini AI
  async generateFinancialInsights(transactions, userAnalytics) {
    try {
      if (!this.genAI) {
        return this.getMockInsights(userAnalytics);
      }

      const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const prompt = `
As a financial advisor AI, analyze the following transaction data and provide personalized financial insights:

**Transaction Summary:**
- Total Income: ₹${userAnalytics.totalIncome}
- Total Expenses: ₹${userAnalytics.totalExpenses}
- Net Balance: ₹${userAnalytics.balance}
- Number of Transactions: ${userAnalytics.transactionCount}
- Average Daily Spending: ₹${userAnalytics.averageDailySpending}

**Category Breakdown:**
${userAnalytics.categoryBreakdown.map(cat => `- ${cat.name}: ₹${cat.amount} (${(cat.percentage * 100).toFixed(1)}%)`).join('\n')}

**Recent Transaction Pattern:**
${transactions.slice(0, 10).map(t => `- ${t.type}: ₹${t.amount} in ${t.category} on ${new Date(t.date).toLocaleDateString()}`).join('\n')}

Please provide:

1. **Key Financial Insights** (3-4 bullet points about spending patterns, trends, and financial health)
2. **Spending Analysis** (What categories dominate spending? Any concerning patterns?)
3. **Monthly Comparison** (How does current spending compare to healthy financial practices?)
4. **Risk Assessment** (Any financial risks or red flags?)

Format your response in markdown with clear sections and actionable insights. Keep it concise but informative.
Focus on practical insights that can help improve financial decision-making.
`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const insights = response.text();

      console.log('✅ Generated AI financial insights');
      return insights;

    } catch (error) {
      console.error('❌ Error generating AI insights:', error.message);
      return this.getMockInsights(userAnalytics);
    }
  }

  // Get personalized financial advice
  async generateFinancialAdvice(transactions, userAnalytics) {
    try {
      if (!this.genAI) {
        return this.getMockAdvice(userAnalytics);
      }

      const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const expenseRatio = userAnalytics.totalIncome > 0 ? (userAnalytics.totalExpenses / userAnalytics.totalIncome) : 0;
      const savingsRate = userAnalytics.totalIncome > 0 ? ((userAnalytics.totalIncome - userAnalytics.totalExpenses) / userAnalytics.totalIncome) : 0;

      const prompt = `
As a personal financial advisor, provide actionable advice based on this user's financial data:

**Financial Overview:**
- Monthly Income: ₹${userAnalytics.totalIncome}
- Monthly Expenses: ₹${userAnalytics.totalExpenses}
- Expense-to-Income Ratio: ${(expenseRatio * 100).toFixed(1)}%
- Savings Rate: ${(savingsRate * 100).toFixed(1)}%
- Top Spending Categories: ${userAnalytics.topCategories.slice(0, 3).map(cat => cat.name).join(', ')}

**Spending Behavior:**
${userAnalytics.categoryBreakdown.map(cat => `- ${cat.name}: ₹${cat.amount} (${(cat.percentage * 100).toFixed(1)}%)`).join('\n')}

Provide personalized financial advice including:

1. **Immediate Action Items** (3-4 specific steps they should take this month)
2. **Budget Optimization** (Which categories to reduce/optimize and by how much)
3. **Savings Strategy** (How to improve savings rate)
4. **Long-term Financial Goals** (Recommendations for financial growth)
5. **Risk Management** (Emergency fund, insurance considerations)

Format in markdown with clear headings and specific, actionable recommendations with amounts where possible.
Make recommendations realistic and achievable based on their current spending patterns.
`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const advice = response.text();

      console.log('✅ Generated AI financial advice');
      return advice;

    } catch (error) {
      console.error('❌ Error generating AI advice:', error.message);
      return this.getMockAdvice(userAnalytics);
    }
  }

  // Analyze spending patterns with AI
  async analyzeSpendingPatterns(transactions) {
    try {
      if (!this.genAI) {
        return this.getMockPatternAnalysis(transactions);
      }

      const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      // Group transactions by day of week and time patterns
      const dayPattern = this.analyzeDayPatterns(transactions);
      const monthlyTrend = this.analyzeMonthlyTrends(transactions);

      const prompt = `
Analyze the following spending patterns and provide insights:

**Daily Spending Patterns:**
${dayPattern.map(day => `${day.day}: ₹${day.amount} (${day.count} transactions)`).join('\n')}

**Monthly Trends:**
${monthlyTrend.map(month => `${month.month}: Income ₹${month.income}, Expenses ₹${month.expenses}`).join('\n')}

**Transaction Frequency:**
- Average transactions per day: ${(transactions.length / 30).toFixed(1)}
- Most expensive single transaction: ₹${Math.max(...transactions.map(t => t.amount))}

Provide insights about:
1. **Behavioral Patterns** (When do they spend most? Peak spending days?)
2. **Spending Triggers** (What might be driving high spending days?)
3. **Optimization Opportunities** (How to smooth out spending patterns?)
4. **Habit Formation** (Recommendations for better spending habits)

Keep response concise and actionable, formatted in markdown.
`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const patterns = response.text();

      console.log('✅ Generated spending pattern analysis');
      return patterns;

    } catch (error) {
      console.error('❌ Error analyzing spending patterns:', error.message);
      return this.getMockPatternAnalysis(transactions);
    }
  }

  // Analyze day-wise spending patterns
  analyzeDayPatterns(transactions) {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayStats = daysOfWeek.map(day => ({ day, amount: 0, count: 0 }));

    transactions.filter(t => t.type === 'expense').forEach(transaction => {
      const dayIndex = new Date(transaction.date).getDay();
      dayStats[dayIndex].amount += transaction.amount;
      dayStats[dayIndex].count += 1;
    });

    return dayStats;
  }

  // Analyze monthly spending trends
  analyzeMonthlyTrends(transactions) {
    const monthlyData = {};
    
    transactions.forEach(transaction => {
      const monthKey = new Date(transaction.date).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long' 
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

    return Object.values(monthlyData).slice(-6); // Last 6 months
  }

  // Get comprehensive user analytics
  async getUserAnalytics(userId, period = '30d') {
    const periodDays = this.getPeriodDays(period);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - periodDays);

    const transactions = await Transaction.find({
      userId: userId,
      date: { $gte: startDate }
    }).sort({ date: -1 });

    // Calculate basic metrics
    const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
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

    // Additional analytics
    const averageDailySpending = totalExpenses / periodDays;
    const transactionCount = transactions.length;
    const largestTransaction = Math.max(...transactions.map(t => t.amount), 0);

    // Generate heatmap data for the last 30 days
    const heatmapData = this.generateHeatmapData(transactions);

    // Weekly spending pattern
    const weeklyPattern = this.analyzeDayPatterns(transactions);

    // Monthly trends
    const monthlyTrend = this.analyzeMonthlyTrends(transactions);

    return {
      transactions,
      totalIncome,
      totalExpenses,
      balance,
      categoryBreakdown,
      topCategories,
      averageDailySpending,
      transactionCount,
      largestTransaction,
      heatmapData,
      weeklyPattern,
      monthlyTrend,
      expenseToIncomeRatio: totalIncome > 0 ? totalExpenses / totalIncome : 0,
      daysAnalyzed: periodDays,
      dataCompleteness: Math.min(1.0, transactionCount / (periodDays * 2)) // Assume 2 transactions per day is "complete"
    };
  }

  // Generate heatmap data for visual representation
  generateHeatmapData(transactions) {
    const last30Days = [];
    const today = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayExpenses = transactions
        .filter(t => t.type === 'expense' && t.date.toISOString().split('T')[0] === dateStr)
        .reduce((sum, t) => sum + t.amount, 0);
      
      last30Days.push({
        date: date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
        amount: dayExpenses
      });
    }
    
    return last30Days;
  }

  // Convert period string to number of days
  getPeriodDays(period) {
    const periods = {
      '7d': 7,
      '30d': 30,
      '90d': 90,
      '6m': 180,
      '1y': 365
    };
    return periods[period] || 30;
  }

  // Mock insights when AI is not available
  getMockInsights(analytics) {
    const expenseRatio = analytics.totalIncome > 0 ? (analytics.totalExpenses / analytics.totalIncome) : 0;
    const topCategory = analytics.topCategories[0] || { name: 'Unknown', amount: 0 };

    return `
## 🎯 Key Financial Insights

### Current Financial Health
- Your **expense-to-income ratio** is ${(expenseRatio * 100).toFixed(1)}%, ${expenseRatio > 0.8 ? '⚠️ which is quite high' : '✅ which is manageable'}
- You've spent **₹${analytics.totalExpenses}** across ${analytics.transactionCount} transactions
- Your **net balance** is ₹${analytics.balance} ${analytics.balance >= 0 ? '💚' : '🔴'}

### 📊 Spending Analysis
- **${topCategory.name}** is your largest expense category at ₹${topCategory.amount} (${(topCategory.percentage * 100).toFixed(1)}% of total expenses)
- Average daily spending: **₹${Math.round(analytics.averageDailySpending)}**
- ${analytics.categoryBreakdown.length} different spending categories tracked

### 🎪 Monthly Comparison
${expenseRatio < 0.5 ? '✅ Excellent expense control - you\'re spending less than 50% of income' : 
  expenseRatio < 0.7 ? '👍 Good financial management - room for optimization' :
  '⚠️ Consider reducing expenses - spending more than 70% of income'}

### ⚡ Financial Health Score
${analytics.balance > analytics.totalIncome * 0.2 ? '🏆 **Excellent** - Strong positive balance' :
  analytics.balance > 0 ? '💪 **Good** - Positive balance maintained' :
  '🚨 **Needs Attention** - Expenses exceed income'}

*AI-powered insights help you make better financial decisions. Keep tracking to see improvements!*
`;
  }

  // Mock advice when AI is not available
  getMockAdvice(analytics) {
    const savingsRate = analytics.totalIncome > 0 ? ((analytics.totalIncome - analytics.totalExpenses) / analytics.totalIncome) : 0;
    const topCategory = analytics.topCategories[0] || { name: 'Unknown', amount: 0 };

    return `
## 💡 Personalized Financial Advice

### 🎯 Immediate Action Items
1. **Track ${topCategory.name} spending** - Your highest expense category needs monitoring
2. **Set daily spending limit** of ₹${Math.round(analytics.averageDailySpending * 0.9)} (10% reduction)
3. **Review and categorize** all uncategorized transactions
4. **Set up automatic savings** of ₹${Math.round(analytics.totalIncome * 0.1)} monthly

### 💰 Budget Optimization
- **Reduce ${topCategory.name} by 15%**: Save ₹${Math.round(topCategory.amount * 0.15)} monthly
- **Focus on top 3 categories** which make up ${Math.round(analytics.topCategories.slice(0, 3).reduce((sum, cat) => sum + cat.percentage, 0) * 100)}% of expenses
- **Analyze discretionary spending** in Entertainment and Shopping categories

### 📈 Savings Strategy
- **Current savings rate**: ${(savingsRate * 100).toFixed(1)}%
- **Target savings rate**: 20-30% of income
- **Monthly savings potential**: ₹${Math.round(analytics.totalIncome * 0.2 - (analytics.totalIncome - analytics.totalExpenses))}

### 🏆 Long-term Financial Goals
1. **Build emergency fund** - Save 6 months of expenses (₹${Math.round(analytics.totalExpenses * 6)})
2. **Investment planning** - Start with 10% of income in mutual funds
3. **Expense automation** - Use UPI autopay for recurring bills
4. **Financial education** - Read about personal finance and investing

### 🛡️ Risk Management
- **Emergency fund status**: ${analytics.balance > analytics.totalExpenses * 3 ? '✅ Good' : '⚠️ Needs building'}
- **Insurance review**: Ensure adequate health and life insurance coverage
- **Diversify income**: Consider additional income streams for financial stability

*Remember: Small consistent changes lead to big financial improvements over time!*
`;
  }

  // Mock pattern analysis
  getMockPatternAnalysis(transactions) {
    const weekendSpending = transactions.filter(t => {
      const day = new Date(t.date).getDay();
      return day === 0 || day === 6; // Sunday or Saturday
    }).reduce((sum, t) => t.type === 'expense' ? sum + t.amount : sum, 0);

    const weekdaySpending = transactions.filter(t => {
      const day = new Date(t.date).getDay();
      return day >= 1 && day <= 5; // Monday to Friday
    }).reduce((sum, t) => t.type === 'expense' ? sum + t.amount : sum, 0);

    return `
## 📊 Spending Pattern Analysis

### 🗓️ Behavioral Patterns
- **Weekend vs Weekday**: You spend ₹${Math.round(weekendSpending)} on weekends vs ₹${Math.round(weekdaySpending)} on weekdays
- **Peak spending**: ${weekendSpending > weekdaySpending ? 'Weekends show higher spending' : 'Weekdays show higher spending'}
- **Transaction frequency**: ${Math.round(transactions.length / 30)} transactions per day on average

### 🎪 Spending Triggers
- **Lifestyle spending**: Entertainment and dining categories peak on weekends
- **Routine expenses**: Utilities and transportation are consistent weekday expenses
- **Impulse purchases**: Higher single-transaction amounts typically occur on ${weekendSpending > weekdaySpending ? 'weekends' : 'weekdays'}

### ⚡ Optimization Opportunities
1. **Weekend budget**: Set a weekly entertainment budget of ₹${Math.round(weekendSpending * 0.8)}
2. **Meal planning**: Reduce food expenses by planning meals in advance
3. **Subscription audit**: Review and cancel unused subscriptions

### 🎯 Habit Formation Recommendations
- **Daily expense tracking**: Log expenses immediately after purchase
- **Weekly reviews**: Every Sunday, review the week's spending
- **Monthly goals**: Set specific spending targets for each category
- **Reward system**: Celebrate when you meet your financial goals

*Understanding your patterns is the first step to financial optimization!*
`;
  }

  // Health check
  isConfigured() {
    return this.genAI !== null;
  }
}

module.exports = new AIFinancialService();
