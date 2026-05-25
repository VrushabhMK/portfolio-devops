const express = require('express');
const router = express.Router();
const { contactValidation } = require('../middleware/validation');
const { submitContact, getContacts, markAsRead, deleteContact } = require('../controllers/contactController');
const { protect, adminOnly } = require('../middleware/auth');

// Public route - submit contact form
router.post('/', contactValidation, submitContact);

// Admin routes
router.get('/', protect, adminOnly, getContacts);
router.put('/:id/read', protect, adminOnly, markAsRead);
router.delete('/:id', protect, adminOnly, deleteContact);

module.exports = router;
