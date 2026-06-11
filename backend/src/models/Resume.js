const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true,
  },
  contentType: {
    type: String,
    required: true,
  },
  data: {
    type: Buffer,
    required: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Resume', resumeSchema);
