const express = require('express');
const {
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
} = require('../controllers/receiptController');
const { auth } = require('../middleware/auth');

const router = express.Router();

// All receipt routes require authentication
router.use(auth);

// Routes
router.post('/upload', (req, res, next) => {
  upload.single('receipt')(req, res, (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({ message: 'File size too large. Maximum size is 10MB.' });
      }
      if (err.message.includes('Only image files')) {
        return res.status(400).json({ message: err.message });
      }
      return res.status(400).json({ message: 'File upload error: ' + err.message });
    }
    next();
  });
}, uploadReceipt);

router.get('/', getReceipts);
router.get('/status', getOCRStatus);
router.get('/:id', getReceipt);
router.get('/:id/image', getReceiptImage);
router.post('/:id/process', processOCR);
router.post('/:id/transaction', createTransactionFromReceipt);
router.put('/:id', updateReceipt);
router.delete('/:id', deleteReceipt);

module.exports = router;
