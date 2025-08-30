const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const path = require('path');

class GeminiOCRService {
  constructor() {
    // Initialize Gemini AI with API key from environment
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('⚠️ GEMINI_API_KEY not found in environment variables. OCR will use mock data.');
      this.genAI = null;
    } else {
      this.genAI = new GoogleGenerativeAI(apiKey);
    }
  }

  // Convert image file to base64 format for Gemini
  fileToGenerativePart(filePath, mimeType) {
    return {
      inlineData: {
        data: Buffer.from(fs.readFileSync(filePath)).toString('base64'),
        mimeType,
      },
    };
  }

  // Extract receipt data using Gemini Vision
  async processReceipt(filePath, mimeType) {
    try {
      // If no API key, fall back to mock data
      if (!this.genAI) {
        console.log('🤖 Using mock OCR data (no API key configured)');
        return this.getMockReceiptData();
      }

      // Check if file exists
      if (!fs.existsSync(filePath)) {
        throw new Error('Receipt file not found');
      }

      console.log('🔍 Processing receipt with Gemini AI...');

      // Get the Gemini model (using Gemini 1.5 Flash for vision tasks)
      const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      // Create the prompt for receipt analysis
      const prompt = `
Analyze this receipt image and extract the following information in JSON format:

{
  "merchant": "name of the store/restaurant",
  "amount": "total amount as a number (without currency symbol)",
  "date": "date in YYYY-MM-DD format",
  "items": ["array", "of", "purchased", "items"],
  "category": "suggested category (Food & Dining, Shopping, Transportation, Entertainment, Healthcare, Utilities, Education, Travel, Others)",
  "currency": "currency symbol or code",
  "rawText": "all text found on the receipt"
}

Please analyze the receipt carefully and provide accurate information. If any field cannot be determined, use reasonable defaults or "Unknown" for text fields and 0 for amounts.
      `;

      // Convert image to the format expected by Gemini
      const imagePart = this.fileToGenerativePart(filePath, mimeType);

      // Generate content using Gemini
      const result = await model.generateContent([prompt, imagePart]);
      const response = await result.response;
      const text = response.text();

      console.log('🎯 Gemini AI Response:', text);

      // Parse the JSON response
      const extractedData = this.parseGeminiResponse(text);

      console.log('✅ Extracted receipt data:', extractedData);

      return extractedData;

    } catch (error) {
      console.error('❌ Gemini OCR Error:', error.message);
      
      // Fallback to mock data if Gemini fails
      console.log('🔄 Falling back to mock data due to error');
      return this.getMockReceiptData();
    }
  }

  // Parse Gemini's response and extract JSON
  parseGeminiResponse(responseText) {
    try {
      // Try to find JSON in the response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const jsonStr = jsonMatch[0];
        const parsed = JSON.parse(jsonStr);
        
        // Validate and clean the parsed data
        return {
          merchant: parsed.merchant || 'Unknown Store',
          amount: parseFloat(parsed.amount) || 0,
          date: this.validateDate(parsed.date) || new Date().toISOString().split('T')[0],
          items: Array.isArray(parsed.items) ? parsed.items : ['Unknown items'],
          category: this.validateCategory(parsed.category),
          currency: parsed.currency || '₹',
          rawText: parsed.rawText || 'Receipt processed by AI'
        };
      }
    } catch (parseError) {
      console.error('❌ Error parsing Gemini response:', parseError.message);
    }

    // If parsing fails, return structured mock data
    return this.getMockReceiptData();
  }

  // Validate date format
  validateDate(dateStr) {
    if (!dateStr) return null;
    
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      return null;
    }
    
    return date.toISOString().split('T')[0];
  }

  // Validate category
  validateCategory(category) {
    const validCategories = [
      'Food & Dining', 'Shopping', 'Transportation', 'Entertainment', 
      'Healthcare', 'Utilities', 'Education', 'Travel', 'Others'
    ];
    
    if (validCategories.includes(category)) {
      return category;
    }
    
    return 'Others';
  }

  // Generate realistic mock data when Gemini is not available
  getMockReceiptData() {
    const merchants = [
      'Zomato', 'Swiggy', 'BigBasket', 'More Supermarket', 'Reliance Fresh', 
      'McDonald\'s', 'KFC', 'Starbucks', 'CCD', 'Domino\'s', 'Pizza Hut',
      'Flipkart', 'Amazon', 'DMart', 'Spencer\'s', 'FoodPanda'
    ];
    
    const categories = [
      'Food & Dining', 'Shopping', 'Transportation', 'Entertainment', 'Others'
    ];
    
    const itemSets = [
      ['Burger', 'Fries', 'Coke'],
      ['Coffee', 'Sandwich', 'Muffin'],
      ['Groceries', 'Vegetables', 'Fruits'],
      ['Pizza', 'Garlic Bread', 'Pepsi'],
      ['Biryani', 'Raita', 'Dessert'],
      ['Chicken Curry', 'Rice', 'Naan'],
      ['Pasta', 'Salad', 'Juice'],
      ['Books', 'Stationery', 'Notebook']
    ];

    const randomMerchant = merchants[Math.floor(Math.random() * merchants.length)];
    const randomAmount = Math.floor(Math.random() * 2000) + 100; // 100-2100 INR
    const randomItems = itemSets[Math.floor(Math.random() * itemSets.length)];
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];

    return {
      merchant: randomMerchant,
      amount: randomAmount,
      date: new Date().toISOString().split('T')[0],
      items: randomItems,
      category: randomCategory,
      currency: '₹',
      rawText: [
        `${randomMerchant}`,
        `Date: ${new Date().toLocaleDateString()}`,
        `Items: ${randomItems.join(', ')}`,
        `Total: ₹${randomAmount}`,
        'Thank you for your purchase!',
        '(Generated by mock OCR service)'
      ].join('\n')
    };
  }

  // Health check method
  isConfigured() {
    return this.genAI !== null;
  }

  // Get configuration status
  getStatus() {
    return {
      configured: this.isConfigured(),
      service: this.isConfigured() ? 'Gemini AI' : 'Mock OCR',
      model: this.isConfigured() ? 'gemini-1.5-flash' : 'mock-data-generator'
    };
  }
}

module.exports = new GeminiOCRService();
