const express = require('express');
const { register, login, getProfile, logout, updateProfile, updatePassword } = require('../controllers/authController');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Routes
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/profile', auth, getProfile);
router.put('/profile', auth, updateProfile);
router.put('/password', auth, updatePassword);

module.exports = router;