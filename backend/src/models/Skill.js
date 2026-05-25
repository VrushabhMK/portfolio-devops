const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Skill name is required'],
    trim: true,
    unique: true,
  },
  category: {
    type: String,
    enum: ['Frontend', 'Backend', 'DevOps', 'Cloud', 'Database', 'Other'],
    required: [true, 'Category is required'],
  },
  level: {
    type: Number,
    required: [true, 'Skill level is required'],
    min: [1, 'Level must be at least 1'],
    max: [100, 'Level cannot exceed 100'],
  },
  icon: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Skill', skillSchema);
