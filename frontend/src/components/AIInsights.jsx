import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { getFinancialInsights, getFinancialAdvice } from '../services/aiService';

const AIInsights = () => {
  const [insights, setInsights] = useState('');
  const [advice, setAdvice] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAIData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [insightsData, adviceData] = await Promise.all([
        getFinancialInsights(),
        getFinancialAdvice()
      ]);

      setInsights(insightsData.data || '');
      setAdvice(adviceData.data || '');
    } catch (err) {
      setError(err.message || 'Failed to fetch AI insights');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAIData();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading AI insights...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="text-red-800">Error: {error}</div>
        <button 
          onClick={fetchAIData} 
          className="mt-2 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Financial Insights */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">AI Financial Insights</h2>
          <button 
            onClick={fetchAIData} 
            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
          >
            Refresh
          </button>
        </div>
        <div className="prose max-w-none">
          {insights ? (
            <ReactMarkdown>{insights}</ReactMarkdown>
          ) : (
            <p className="text-gray-500">
              No insights available. Add some transactions to get AI analysis.
            </p>
          )}
        </div>
      </div>

      {/* Financial Advice */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Personalized Financial Advice</h2>
          <button 
            onClick={fetchAIData} 
            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
          >
            Refresh
          </button>
        </div>
        <div className="prose max-w-none">
          {advice ? (
            <ReactMarkdown>{advice}</ReactMarkdown>
          ) : (
            <p className="text-gray-500">
              No advice available. Add more transaction data to get recommendations.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIInsights;
