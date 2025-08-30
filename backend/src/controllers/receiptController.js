const Receipt = require('../models/Receipt');
const Transaction = require('../models/Transaction');
const geminiOCR = require('../services/geminiOCR');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'uploads/receipts';
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `receipt-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const fileFilter = (req, file, cb) => {
  // Accept images and PDFs
  const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (JPEG, PNG) and PDF files are allowed'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit to match frontend
  }
});

// Upload receipt
const uploadReceipt = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { description, amount, category } = req.body;

    const receipt = new Receipt({
      userId: req.userId,
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      path: req.file.path,
      description: description || '',
      amount: amount ? parseFloat(amount) : 0,
      category: category || 'Others'
    });

    await receipt.save();

    // Auto-cleanup: Keep only the latest 10 receipts per user
    const userReceipts = await Receipt.find({ userId: req.userId })
      .sort({ createdAt: -1 });
    
    if (userReceipts.length > 10) {
      const receiptsToDelete = userReceipts.slice(10);
      for (const oldReceipt of receiptsToDelete) {
        // Delete file from filesystem
        if (fs.existsSync(oldReceipt.path)) {
          fs.unlinkSync(oldReceipt.path);
        }
        // Delete from database
        await Receipt.findByIdAndDelete(oldReceipt._id);
      }
    }

    res.status(201).json({
      message: 'Receipt uploaded successfully',
      receipt: {
        id: receipt._id,
        filename: receipt.filename,
        originalName: receipt.originalName,
        description: receipt.description,
        amount: receipt.amount,
        category: receipt.category,
        createdAt: receipt.createdAt
      }
    });
  } catch (error) {
    // Clean up uploaded file if database save fails
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    // Handle multer errors
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({ message: 'File size too large. Maximum size is 10MB.' });
    }
    
    res.status(400).json({ message: error.message });
  }
};

// Get all receipts for user
const getReceipts = async (req, res) => {
  try {
    const receipts = await Receipt.find({ userId: req.userId })
      .select('-path') // Don't include file path in response
      .sort({ createdAt: -1 });
    
    // Transform response to match frontend expectations
    const transformedReceipts = receipts.map(receipt => ({
      _id: receipt._id,
      filename: receipt.filename,
      originalName: receipt.originalName,
      fileSize: receipt.size,
      uploadDate: receipt.createdAt,
      description: receipt.description,
      amount: receipt.amount,
      category: receipt.category,
      processed: receipt.processed,
      extractedData: receipt.processed ? {
        amount: receipt.amount,
        merchant: receipt.description || 'Unknown',
        date: receipt.createdAt.toISOString().split('T')[0],
        items: receipt.description ? [receipt.description] : [],
        rawText: receipt.description
      } : null
    }));
    
    res.json({ receipts: transformedReceipts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single receipt
const getReceipt = async (req, res) => {
  try {
    const receipt = await Receipt.findOne({
      _id: req.params.id,
      userId: req.userId
    }).select('-path');

    if (!receipt) {
      return res.status(404).json({ message: 'Receipt not found' });
    }

    res.json({ receipt });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Serve receipt image
const getReceiptImage = async (req, res) => {
  try {
    const receipt = await Receipt.findOne({
      _id: req.params.id,
      userId: req.userId
    });

    if (!receipt) {
      return res.status(404).json({ message: 'Receipt not found' });
    }

    // Check if file exists
    if (!fs.existsSync(receipt.path)) {
      return res.status(404).json({ message: 'Receipt file not found' });
    }

    // Set appropriate headers
    res.setHeader('Content-Type', receipt.mimeType);
    res.setHeader('Content-Disposition', `inline; filename="${receipt.originalName}"`);

    // Send file
    res.sendFile(path.resolve(receipt.path));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete receipt
const deleteReceipt = async (req, res) => {
  try {
    const receipt = await Receipt.findOne({
      _id: req.params.id,
      userId: req.userId
    });

    if (!receipt) {
      return res.status(404).json({ message: 'Receipt not found' });
    }

    // Delete file from filesystem
    if (fs.existsSync(receipt.path)) {
      fs.unlinkSync(receipt.path);
    }

    // Delete from database
    await Receipt.findByIdAndDelete(receipt._id);

    res.json({ message: 'Receipt deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Process OCR for a receipt using Gemini AI
const processOCR = async (req, res) => {
  try {
    const receipt = await Receipt.findOne({
      _id: req.params.id,
      userId: req.userId
    });

    if (!receipt) {
      return res.status(404).json({ message: 'Receipt not found' });
    }

    if (receipt.processed) {
      // Return existing extracted data
      const existingData = {
        merchant: receipt.description || 'Unknown Store',
        amount: receipt.amount,
        date: receipt.createdAt.toISOString().split('T')[0],
        items: receipt.description ? receipt.description.split(',').map(item => item.trim()) : ['Various items'],
        category: receipt.category || 'Others',
        currency: '₹',
        rawText: `Receipt from ${receipt.description || 'Store'}\nAmount: ₹${receipt.amount}\nDate: ${receipt.createdAt.toLocaleDateString()}`
      };
      
      return res.json({ 
        message: 'Receipt already processed',
        extractedData: existingData,
        service: 'cached'
      });
    }

    console.log(`🔍 Processing receipt: ${receipt.filename} with Gemini OCR`);

    // Check if the physical file exists
    if (!fs.existsSync(receipt.path)) {
      return res.status(404).json({ 
        message: 'Receipt file not found on server. Please re-upload the receipt.' 
      });
    }

    // Use Gemini AI to process the receipt
    const extractedData = await geminiOCR.processReceipt(receipt.path, receipt.mimeType);

    // Update receipt with extracted data
    receipt.processed = true;
    receipt.amount = extractedData.amount || 0;
    receipt.description = extractedData.merchant || 'Unknown Store';
    receipt.category = extractedData.category || 'Others';
    await receipt.save();

    console.log('✅ Receipt processed successfully:', {
      id: receipt._id,
      merchant: extractedData.merchant,
      amount: extractedData.amount
    });

    res.json({ 
      message: 'OCR processing completed successfully',
      extractedData,
      service: geminiOCR.getStatus(),
      receiptId: receipt._id
    });

  } catch (error) {
    console.error('❌ OCR Processing Error:', error);
    
    // Provide helpful error messages
    let errorMessage = 'OCR processing failed';
    
    if (error.message.includes('API_KEY')) {
      errorMessage = 'OCR service configuration error. Please contact support.';
    } else if (error.message.includes('file not found')) {
      errorMessage = 'Receipt file not found. Please re-upload the receipt.';
    } else if (error.message.includes('quota')) {
      errorMessage = 'OCR service temporarily unavailable. Please try again later.';
    } else if (error.message.includes('invalid')) {
      errorMessage = 'Unable to process this receipt. Please ensure the image is clear and readable.';
    }

    res.status(500).json({ 
      message: errorMessage,
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      service: geminiOCR.getStatus()
    });
  }
};

// Update receipt details
const updateReceipt = async (req, res) => {
  try {
    const { description, amount, category } = req.body;

    const receipt = await Receipt.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { 
        description: description || '',
        amount: amount ? parseFloat(amount) : 0,
        category: category || 'Others'
      },
      { new: true }
    ).select('-path');

    if (!receipt) {
      return res.status(404).json({ message: 'Receipt not found' });
    }

    res.json({ message: 'Receipt updated successfully', receipt });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get OCR service status
const getOCRStatus = async (req, res) => {
  try {
    const status = geminiOCR.getStatus();
    res.json({
      status: 'OK',
      ocr: status,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to get OCR status',
      error: error.message 
    });
  }
};

// Create transaction from receipt
const createTransactionFromReceipt = async (req, res) => {
  try {
    const { type = 'expense', category } = req.body;
    
    const receipt = await Receipt.findOne({
      _id: req.params.id,
      userId: req.userId
    });

    if (!receipt) {
      return res.status(404).json({ message: 'Receipt not found' });
    }

    if (!receipt.processed) {
      return res.status(400).json({ message: 'Receipt must be processed before creating transaction' });
    }

    // Check if transaction already exists for this receipt
    const existingTransaction = await Transaction.findOne({ 
      receiptId: receipt._id, 
      userId: req.userId 
    });

    if (existingTransaction) {
      return res.status(400).json({ 
        message: 'Transaction already exists for this receipt',
        transactionId: existingTransaction._id
      });
    }

    // Create transaction from receipt data
    const transaction = new Transaction({
      userId: req.userId,
      type,
      amount: receipt.amount,
      category: category || receipt.category || 'Others',
      description: receipt.description || `Receipt transaction - ${receipt.originalName}`,
      date: receipt.createdAt,
      receiptId: receipt._id
    });

    await transaction.save();

    res.status(201).json({ 
      message: 'Transaction created from receipt successfully',
      transaction,
      receipt: {
        id: receipt._id,
        filename: receipt.filename,
        amount: receipt.amount
      }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  upload,
  uploadReceipt,
  getReceipts,
  getReceipt,
  getReceiptImage,
  processOCR,
  createTransactionFromReceipt,
  getOCRStatus,
  deleteReceipt,
  updateReceipt
};
