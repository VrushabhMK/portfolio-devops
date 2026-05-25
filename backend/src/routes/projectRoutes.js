const express = require('express');
const router = express.Router();
const { projectValidation } = require('../middleware/validation');
const {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
} = require('../controllers/projectController');
const { protect, adminOnly } = require('../middleware/auth');

// Public routes
router.get('/', getProjects);
router.get('/:id', getProject);

// Admin routes
router.post('/', protect, adminOnly, projectValidation, createProject);
router.put('/:id', protect, adminOnly, projectValidation, updateProject);
router.delete('/:id', protect, adminOnly, deleteProject);

module.exports = router;
