import { api } from './api';

export const getFinancialInsights = async () => {
  try {
    const response = await api.get('/ai/insights', { timeout: 65000 });
    return response; // interceptor already returns response.data
  } catch (error) {
    console.error('Error fetching financial insights:', error);
    throw error;
  }
};

export const getFinancialAdvice = async () => {
  try {
    const response = await api.get('/ai/advice', { timeout: 65000 });
    return response; // interceptor already returns response.data
  } catch (error) {
    console.error('Error fetching financial advice:', error);
    throw error;
  }
};

export const getCategoryAnalysis = async (period = '30d') => {
  try {
    const response = await api.get('/ai/category-analysis', { 
      params: { period },
      timeout: 30000 
    });
    return response;
  } catch (error) {
    console.error('Error fetching category analysis:', error);
    throw error;
  }
};

export const getSpendingPatterns = async (period = '30d') => {
  try {
    const response = await api.get('/ai/spending-patterns', { 
      params: { period },
      timeout: 65000 
    });
    return response;
  } catch (error) {
    console.error('Error fetching spending patterns:', error);
    throw error;
  }
};

export const getDetailedAnalytics = async (period = '30d') => {
  try {
    const response = await api.get('/ai/detailed-analytics', { 
      params: { period },
      timeout: 65000 
    });
    return response;
  } catch (error) {
    console.error('Error fetching detailed analytics:', error);
    throw error;
  }
};
