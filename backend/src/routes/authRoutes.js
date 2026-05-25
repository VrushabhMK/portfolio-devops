const express = require('express');
const router = express.Router();
const { loginValidation } = require('../middleware/validation');
const { register, login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', loginValidation, login);
router.get('/me', protect, getMe);

module.exports = router;
