const express = require('express');
const router = express.Router();
const multer = require('multer');
const Resume = require('../models/Resume');
const { protect, adminOnly } = require('../middleware/auth');

// Multer setup using memory storage to retrieve the file as a buffer
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // Limit size to 10MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed!'), false);
    }
  }
});

// @route   POST /api/resume/upload
// @desc    Upload new resume PDF (Admin Only)
// @access  Private
router.post('/upload', protect, adminOnly, upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a resume PDF file to upload',
      });
    }

    // Retrieve or create the resume record
    let resume = await Resume.findOne();
    if (resume) {
      resume.filename = req.file.originalname;
      resume.contentType = req.file.mimetype;
      resume.data = req.file.buffer;
      await resume.save();
    } else {
      resume = await Resume.create({
        filename: req.file.originalname,
        contentType: req.file.mimetype,
        data: req.file.buffer,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Resume uploaded and stored in MongoDB successfully',
      data: {
        filename: resume.filename,
        updatedAt: resume.updatedAt,
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to upload resume',
      error: error.message,
    });
  }
});

// @route   GET /api/resume/download
// @desc    Download/view the stored resume PDF
// @access  Public
router.get('/download', async (req, res) => {
  try {
    const resume = await Resume.findOne().sort({ updatedAt: -1 });
    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found on server',
      });
    }

    res.set({
      'Content-Type': resume.contentType,
      'Content-Disposition': `inline; filename="${resume.filename}"`,
      'Content-Length': resume.data.length,
    });

    res.send(resume.data);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to download resume',
      error: error.message,
    });
  }
});

module.exports = router;
